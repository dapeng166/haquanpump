<?php
/**
 * Plugin Name:  Haquan — Products
 * Description:  Registers the pump CPT, the pump_series taxonomy and the product specification + gallery ACF fields. Requires the free ACF plugin. Product main image = Featured Image; Gallery Image 1–4 are extras. You create your own Pump Series in wp-admin (no pre-seeded categories).
 * Version:      1.1.0
 * Author:       Haquan
 *
 * Field names + series slugs match the Next.js front-end (lib/wordpress.ts).
 * No certificate fields. Can also be dropped into wp-content/mu-plugins/.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------------------------------------------------------------------
 * 1. Product post type + series taxonomy
 * ------------------------------------------------------------------- */
add_action( 'init', function () {
	register_post_type( 'pump', array(
		'labels' => array(
			'name'          => 'Pumps',
			'singular_name' => 'Pump',
			'menu_name'     => 'Pumps',
			'add_new_item'  => 'Add Pump',
			'edit_item'     => 'Edit Pump',
			'all_items'     => 'All Pumps',
		),
		'public'        => true,
		'show_in_rest'  => true,            // /wp-json/wp/v2/pump
		'rest_base'     => 'pump',
		'menu_icon'     => 'dashicons-database',
		'menu_position' => 20,
		'has_archive'   => true,
		'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
	) );

	register_taxonomy( 'pump_series', 'pump', array(
		'labels' => array(
			'name'          => 'Pump Series',
			'singular_name' => 'Pump Series',
			'menu_name'     => 'Pump Series',
		),
		'public'            => true,
		'hierarchical'      => true,
		'show_in_rest'      => true,        // /wp-json/wp/v2/pump_series
		'rest_base'         => 'pump_series',
		'show_admin_column' => true,
	) );

	// No pre-seeded series — create your own Pump Series in wp-admin, so the
	// taxonomy stays clean (empty categories you delete will not come back).
}, 5 );

/* ---------------------------------------------------------------------
 * 2. Product specification fields (ACF FREE)
 * ------------------------------------------------------------------- */
add_action( 'acf/init', function () {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	acf_add_local_field_group( array(
		'key'          => 'group_pump_specs',
		'title'        => 'Pump Specifications',
		'show_in_rest' => 1, // expose `acf` in REST (critical for Next.js)
		'location'     => array(
			array(
				array(
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'pump',
				),
			),
		),
		'menu_order'      => 0,
		'position'        => 'normal',
		'label_placement' => 'top',
		'fields' => array(
			array( 'key' => 'field_pump_model',    'label' => 'Model',                        'name' => 'model',                  'type' => 'text', 'instructions' => 'e.g. WQ, ISG, QBY' ),
			array( 'key' => 'field_pump_flow',     'label' => 'Flow Rate (m³/h)',             'name' => 'flow_rate',              'type' => 'text', 'instructions' => 'e.g. 10 – 1200' ),
			array( 'key' => 'field_pump_head',     'label' => 'Head (m)',                     'name' => 'head',                   'type' => 'text', 'instructions' => 'e.g. 5 – 40' ),
			array( 'key' => 'field_pump_power',    'label' => 'Power (kW)',                   'name' => 'power',                  'type' => 'text', 'instructions' => 'e.g. 0.75 – 90' ),
			array( 'key' => 'field_pump_diameter', 'label' => 'Inlet / Outlet Diameter (mm)', 'name' => 'inlet_outlet_diameter', 'type' => 'text', 'instructions' => 'e.g. 50 – 300' ),
			array( 'key' => 'field_pump_material', 'label' => 'Material',                     'name' => 'material',               'type' => 'text', 'instructions' => 'e.g. Cast Iron HT200 / SS316L' ),
			array( 'key' => 'field_pump_apps',     'label' => 'Applications',                 'name' => 'applications',           'type' => 'text', 'instructions' => 'Comma-separated, e.g. Mining, Municipal Water, Marine' ),
			array( 'key' => 'field_pump_seo',      'label' => 'SEO Keywords',                 'name' => 'seo_keywords',           'type' => 'text', 'instructions' => 'Comma-separated keywords for Google, e.g. submersible sewage pump, WQ pump, dewatering pump' ),

			// Image gallery (ACF FREE has no Gallery field → individual Image fields).
			// The MAIN image is the post's Featured Image; these are extra photos.
			array( 'key' => 'field_pump_gal1', 'label' => 'Gallery Image 1', 'name' => 'gallery_image_1', 'type' => 'image', 'return_format' => 'url', 'instructions' => 'Extra product photo (main photo = Featured Image)' ),
			array( 'key' => 'field_pump_gal2', 'label' => 'Gallery Image 2', 'name' => 'gallery_image_2', 'type' => 'image', 'return_format' => 'url' ),
			array( 'key' => 'field_pump_gal3', 'label' => 'Gallery Image 3', 'name' => 'gallery_image_3', 'type' => 'image', 'return_format' => 'url' ),
			array( 'key' => 'field_pump_gal4', 'label' => 'Gallery Image 4', 'name' => 'gallery_image_4', 'type' => 'image', 'return_format' => 'url' ),

			array( 'key' => 'field_pump_brochure', 'label' => 'PDF Brochure',                'name' => 'pdf_brochure',           'type' => 'file', 'return_format' => 'url', 'mime_types' => 'pdf' ),
			array( 'key' => 'field_pump_featured', 'label' => 'Show on Homepage (Featured)', 'name' => 'featured',               'type' => 'true_false', 'ui' => 1 ),
		),
	) );
} );

/* ---------------------------------------------------------------------
 * 3. Expose resolved image URLs in REST.
 *    ACF returns image fields as attachment IDs in the REST `acf` object,
 *    so we add a `gallery` field that returns real URLs (Featured Image
 *    first, then Gallery Image 1–4), de-duplicated.
 * ------------------------------------------------------------------- */
add_action( 'rest_api_init', function () {
	register_rest_field( 'pump', 'gallery', array(
		'get_callback' => function ( $post ) {
			$urls  = array();
			$thumb = get_post_thumbnail_id( $post['id'] );
			if ( $thumb ) {
				$u = wp_get_attachment_url( $thumb );
				if ( $u ) {
					$urls[] = $u;
				}
			}
			foreach ( array( 'gallery_image_1', 'gallery_image_2', 'gallery_image_3', 'gallery_image_4' ) as $field ) {
				$val = function_exists( 'get_field' ) ? get_field( $field, $post['id'] ) : '';
				if ( is_array( $val ) && ! empty( $val['url'] ) ) {
					$val = $val['url'];
				} elseif ( is_numeric( $val ) ) {
					$val = wp_get_attachment_url( (int) $val );
				}
				if ( is_string( $val ) && $val !== '' ) {
					$urls[] = $val;
				}
			}
			return array_values( array_unique( array_filter( $urls ) ) );
		},
		'schema' => array(
			'type'  => 'array',
			'items' => array( 'type' => 'string' ),
		),
	) );
} );
