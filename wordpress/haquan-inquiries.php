<?php
/**
 * Plugin Name:  Haquan — Inquiries
 * Description:  Stores contact-form / product inquiries from the Next.js site in WordPress (a new "Inquiries" admin section) and emails a notification to sales@haquanpump.com. Provides the REST endpoint POST /wp-json/haquan/v1/inquiry used by the website.
 * Version:      1.0.0
 * Author:       Haquan
 *
 * The website never loses a message: every submission becomes an `inquiry`
 * post you can read in wp-admin, and an email is sent as a notification on top.
 * The endpoint is hardened with a honeypot + per-IP rate limit (no secret key,
 * so nothing sensitive lives in the public repo).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Where notification emails go. Override with the haquan_inquiry_notify filter. */
function haquan_inquiry_notify_email() {
	return apply_filters( 'haquan_inquiry_notify_email', 'sales@haquanpump.com' );
}

/* ---------------------------------------------------------------------
 * 1. Inquiry post type (admin-only; submissions arrive via REST)
 * ------------------------------------------------------------------- */
add_action( 'init', function () {
	register_post_type( 'inquiry', array(
		'labels' => array(
			'name'          => 'Inquiries',
			'singular_name' => 'Inquiry',
			'menu_name'     => 'Inquiries',
			'all_items'     => 'All Inquiries',
			'edit_item'     => 'View Inquiry',
			'search_items'  => 'Search Inquiries',
		),
		'public'             => false,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'menu_icon'          => 'dashicons-email-alt',
		'menu_position'      => 26,
		'supports'           => array( 'title', 'editor' ),
		'capability_type'    => 'post',
		'map_meta_cap'       => true,
		// Messages are created by the website, not typed in by hand.
		'capabilities'       => array( 'create_posts' => 'do_not_allow' ),
	) );
} );

/* ---------------------------------------------------------------------
 * 2. REST endpoint the website posts to: /wp-json/haquan/v1/inquiry
 * ------------------------------------------------------------------- */
add_action( 'rest_api_init', function () {
	register_rest_route( 'haquan/v1', '/inquiry', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true', // public contact form; hardened below
		'callback'            => 'haquan_handle_inquiry',
	) );
} );

function haquan_handle_inquiry( WP_REST_Request $request ) {
	$p = $request->get_json_params();
	if ( ! is_array( $p ) ) {
		$p = $request->get_params();
	}

	// Honeypot: real users never fill the hidden "website" field. Pretend success
	// so bots move on without learning they were blocked.
	if ( ! empty( $p['website'] ) ) {
		return new WP_REST_Response( array( 'ok' => true ), 200 );
	}

	// Per-IP rate limit: max 5 submissions per 10 minutes.
	$ip  = haquan_inquiry_ip();
	$key = 'haquan_inq_' . md5( $ip );
	$hits = (int) get_transient( $key );
	if ( $hits >= 5 ) {
		return new WP_REST_Response(
			array( 'ok' => false, 'error' => 'Too many requests. Please try again later.' ),
			429
		);
	}

	$name    = isset( $p['name'] ) ? sanitize_text_field( $p['name'] ) : '';
	$email   = isset( $p['email'] ) ? sanitize_email( $p['email'] ) : '';
	$phone   = isset( $p['phone'] ) ? sanitize_text_field( $p['phone'] ) : '';
	$company = isset( $p['company'] ) ? sanitize_text_field( $p['company'] ) : '';
	$product = isset( $p['product'] ) ? sanitize_text_field( $p['product'] ) : '';
	$message = isset( $p['message'] ) ? sanitize_textarea_field( $p['message'] ) : '';

	if ( '' === $name || '' === $message || ! is_email( $email ) ) {
		return new WP_REST_Response(
			array( 'ok' => false, 'error' => 'Name, a valid email and a message are required.' ),
			422
		);
	}

	// Store the inquiry so it can never be lost, even if email fails.
	$title   = $name . ( $product ? ' — ' . $product : '' );
	$post_id = wp_insert_post( array(
		'post_type'    => 'inquiry',
		'post_status'  => 'publish',
		'post_title'   => $title,
		'post_content' => $message,
	), true );

	if ( is_wp_error( $post_id ) ) {
		return new WP_REST_Response( array( 'ok' => false, 'error' => 'Could not save inquiry.' ), 500 );
	}

	update_post_meta( $post_id, '_haquan_email', $email );
	update_post_meta( $post_id, '_haquan_phone', $phone );
	update_post_meta( $post_id, '_haquan_company', $company );
	update_post_meta( $post_id, '_haquan_product', $product );
	update_post_meta( $post_id, '_haquan_ip', $ip );
	update_post_meta( $post_id, '_haquan_read', '0' );

	set_transient( $key, $hits + 1, 10 * MINUTE_IN_SECONDS );

	// Email notification (best-effort; the stored post is the source of truth).
	haquan_inquiry_notify( compact( 'name', 'email', 'phone', 'company', 'product', 'message' ) );

	return new WP_REST_Response( array( 'ok' => true, 'id' => $post_id ), 201 );
}

function haquan_inquiry_ip() {
	$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
	// Respect a forwarding proxy if present (Hostinger / Cloudflare).
	if ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
		$parts = explode( ',', $_SERVER['HTTP_X_FORWARDED_FOR'] );
		$ip    = trim( $parts[0] );
	}
	return preg_replace( '/[^0-9a-fA-F:.]/', '', $ip );
}

function haquan_inquiry_notify( array $d ) {
	$to      = haquan_inquiry_notify_email();
	$subject = 'New website inquiry from ' . $d['name'] . ( $d['company'] ? ' (' . $d['company'] . ')' : '' );

	$lines = array(
		'You have a new inquiry from the website.',
		'',
		'Name:    ' . $d['name'],
		'Email:   ' . $d['email'],
		'Phone:   ' . ( $d['phone'] ? $d['phone'] : '—' ),
		'Company: ' . ( $d['company'] ? $d['company'] : '—' ),
		'Product: ' . ( $d['product'] ? $d['product'] : '—' ),
		'',
		'Message:',
		$d['message'],
		'',
		'— View all inquiries in WordPress → Inquiries.',
	);

	$headers = array(
		'Content-Type: text/plain; charset=UTF-8',
		'Reply-To: ' . $d['name'] . ' <' . $d['email'] . '>',
	);

	wp_mail( $to, $subject, implode( "\n", $lines ), $headers );
}

/* ---------------------------------------------------------------------
 * 3. Admin list: useful columns at a glance
 * ------------------------------------------------------------------- */
add_filter( 'manage_inquiry_posts_columns', function ( $cols ) {
	return array(
		'cb'              => isset( $cols['cb'] ) ? $cols['cb'] : '',
		'title'           => 'Name / Product',
		'haquan_email'    => 'Email',
		'haquan_phone'    => 'Phone',
		'haquan_company'  => 'Company',
		'date'            => 'Received',
	);
} );

add_action( 'manage_inquiry_posts_custom_column', function ( $col, $post_id ) {
	if ( 'haquan_email' === $col ) {
		$email = get_post_meta( $post_id, '_haquan_email', true );
		echo $email ? '<a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>' : '—';
	} elseif ( 'haquan_phone' === $col ) {
		echo esc_html( get_post_meta( $post_id, '_haquan_phone', true ) ?: '—' );
	} elseif ( 'haquan_company' === $col ) {
		echo esc_html( get_post_meta( $post_id, '_haquan_company', true ) ?: '—' );
	}
}, 10, 2 );

/* ---------------------------------------------------------------------
 * 4. Detail metabox (contact info shown read-only above the message)
 * ------------------------------------------------------------------- */
add_action( 'add_meta_boxes', function () {
	add_meta_box( 'haquan_inquiry_details', 'Inquiry Details', function ( $post ) {
		$rows = array(
			'Email'   => get_post_meta( $post->ID, '_haquan_email', true ),
			'Phone'   => get_post_meta( $post->ID, '_haquan_phone', true ),
			'Company' => get_post_meta( $post->ID, '_haquan_company', true ),
			'Product' => get_post_meta( $post->ID, '_haquan_product', true ),
			'IP'      => get_post_meta( $post->ID, '_haquan_ip', true ),
		);
		echo '<table class="widefat striped"><tbody>';
		foreach ( $rows as $label => $val ) {
			$display = $val ? esc_html( $val ) : '—';
			if ( 'Email' === $label && $val ) {
				$display = '<a href="mailto:' . esc_attr( $val ) . '">' . esc_html( $val ) . '</a>';
			}
			echo '<tr><th style="width:120px;text-align:left">' . esc_html( $label ) . '</th><td>' . $display . '</td></tr>';
		}
		echo '</tbody></table>';
		echo '<p style="margin-top:8px;color:#666">The message itself is shown in the editor below.</p>';
	}, 'inquiry', 'normal', 'high' );
} );

/* ---------------------------------------------------------------------
 * 5. Unread badge on the Inquiries menu + mark read on open
 * ------------------------------------------------------------------- */
add_action( 'admin_menu', function () {
	$q = new WP_Query( array(
		'post_type'      => 'inquiry',
		'post_status'    => 'publish',
		'meta_key'       => '_haquan_read',
		'meta_value'     => '0',
		'fields'         => 'ids',
		'posts_per_page' => 50,
		'no_found_rows'  => false,
	) );
	$count = $q->found_posts;
	if ( $count ) {
		global $menu;
		foreach ( $menu as $k => $m ) {
			if ( isset( $m[2] ) && 'edit.php?post_type=inquiry' === $m[2] ) {
				$menu[ $k ][0] .= ' <span class="awaiting-mod">' . (int) $count . '</span>';
				break;
			}
		}
	}
}, 999 );

add_action( 'load-post.php', function () {
	if ( isset( $_GET['post'] ) && 'inquiry' === get_post_type( (int) $_GET['post'] ) ) {
		update_post_meta( (int) $_GET['post'], '_haquan_read', '1' );
	}
} );
