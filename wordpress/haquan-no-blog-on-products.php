<?php
/**
 * Plugin Name:  Haquan — No Blog Category on Products
 * Description:  WordPress puts a pump that has no category into the default category ("Blog") when it is published (also scheduled publishing) or saved in the editor. Products are grouped by Pump Series, so this removes that automatic default. Technical guides and case studies keep the categories chosen for them.
 * Version:      1.0.0
 * Author:       Haquan
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Remove the default category from a pump when it is the ONLY category.
 * A pump filed under Technical Guide, Case Studies etc. is left alone.
 */
function haquan_strip_default_category( $post_id ) {
	if ( 'pump' !== get_post_type( $post_id ) ) {
		return;
	}
	$default = (int) get_option( 'default_category' );
	if ( ! $default ) {
		return;
	}
	$cats = wp_get_object_terms( $post_id, 'category', array( 'fields' => 'ids' ) );
	if ( is_wp_error( $cats ) ) {
		return;
	}
	if ( 1 === count( $cats ) && $default === (int) $cats[0] ) {
		wp_remove_object_terms( $post_id, $default, 'category' );
	}
}

// Right after terms are written (covers wp_publish_post for scheduled posts).
add_action( 'set_object_terms', function ( $object_id, $terms, $tt_ids, $taxonomy ) {
	if ( 'category' === $taxonomy ) {
		haquan_strip_default_category( $object_id );
	}
}, 20, 4 );

// After every save, including the block editor and REST.
add_action( 'wp_after_insert_post', function ( $post_id ) {
	haquan_strip_default_category( $post_id );
}, 99 );
