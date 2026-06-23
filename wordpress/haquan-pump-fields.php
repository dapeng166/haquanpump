<?php
/**
 * Haquan — Product (pump) specification fields
 * Paste into your theme's functions.php (or wp-content/mu-plugins/).
 *
 * Adds an ACF FREE field group to the EXISTING `pump` CPT so each product
 * is entered with a clean form. Field names match what the Next.js front-end
 * reads (lib/wordpress.ts → mapPump). No certificate fields (per brand spec).
 *
 * Product MAIN IMAGE = the post's built-in "Featured Image" (no ACF needed).
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* Make sure the existing `pump` CPT is exposed to the REST API.
 * (Skip / harmless if it is already registered with show_in_rest = true.) */
add_filter( 'register_post_type_args', function ( $args, $post_type ) {
	if ( 'pump' === $post_type ) {
		$args['show_in_rest'] = true;
		if ( empty( $args['rest_base'] ) ) {
			$args['rest_base'] = 'pump';
		}
	}
	return $args;
}, 10, 2 );

/* Product specification fields */
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
			array( 'key' => 'field_pump_model',    'label' => 'Model',                       'name' => 'model',                  'type' => 'text', 'instructions' => 'e.g. WQ, ISG, QBY' ),
			array( 'key' => 'field_pump_flow',     'label' => 'Flow Rate (m³/h)',            'name' => 'flow_rate',              'type' => 'text', 'instructions' => 'e.g. 10 – 1200' ),
			array( 'key' => 'field_pump_head',     'label' => 'Head (m)',                    'name' => 'head',                   'type' => 'text', 'instructions' => 'e.g. 5 – 40' ),
			array( 'key' => 'field_pump_power',    'label' => 'Power (kW)',                  'name' => 'power',                  'type' => 'text', 'instructions' => 'e.g. 0.75 – 90' ),
			array( 'key' => 'field_pump_diameter', 'label' => 'Inlet / Outlet Diameter (mm)', 'name' => 'inlet_outlet_diameter', 'type' => 'text', 'instructions' => 'e.g. 50 – 300' ),
			array( 'key' => 'field_pump_material', 'label' => 'Material',                    'name' => 'material',               'type' => 'text', 'instructions' => 'e.g. Cast Iron HT200 / SS316L' ),
			array( 'key' => 'field_pump_apps',     'label' => 'Applications',                'name' => 'applications',           'type' => 'text', 'instructions' => 'Comma-separated, e.g. Mining, Municipal Water, Marine' ),

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
