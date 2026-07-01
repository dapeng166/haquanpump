<?php
/**
 * Plugin Name:  Haquan — Documents
 * Description:  Registers a "document" post type for the Support page's downloadable technical documents. Each document = a title + a PDF upload + a type label. Add as many as you like (no 6-slot limit, no overwriting). Requires the free ACF plugin.
 * Version:      1.0.0
 * Author:       Haquan
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------------------------------------------------------------------
 * 1. "document" post type (add documents like you add products)
 * ------------------------------------------------------------------- */
add_action( 'init', function () {
	register_post_type( 'document', array(
		'labels' => array(
			'name'          => 'Documents',
			'singular_name' => 'Document',
			'menu_name'     => 'Documents',
			'add_new_item'  => 'Add Document',
			'edit_item'     => 'Edit Document',
			'all_items'     => 'All Documents',
		),
		'public'        => true,
		'show_in_rest'  => true,            // /wp-json/wp/v2/document
		'rest_base'     => 'document',
		'menu_icon'     => 'dashicons-media-document',
		'menu_position' => 24,
		'has_archive'   => false,
		'supports'      => array( 'title', 'page-attributes' ), // page-attributes = manual order
	) );
}, 5 );

/* ---------------------------------------------------------------------
 * 2. ACF fields: the PDF file + a type label
 * ------------------------------------------------------------------- */
add_action( 'acf/init', function () {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}
	acf_add_local_field_group( array(
		'key'          => 'group_haquan_document',
		'title'        => 'Document',
		'show_in_rest' => 1,
		'location'     => array(
			array(
				array(
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'document',
				),
			),
		),
		'menu_order'      => 0,
		'position'        => 'normal',
		'label_placement' => 'top',
		'fields' => array(
			array( 'key' => 'field_haquan_doc_file', 'label' => 'PDF File', 'name' => 'file', 'type' => 'file', 'return_format' => 'url', 'mime_types' => 'pdf', 'required' => 1 ),
			array( 'key' => 'field_haquan_doc_type', 'label' => 'Type label (e.g. Catalogue, Datasheet, Performance Curves)', 'name' => 'doc_type', 'type' => 'text' ),
		),
	) );
}, 5 );

/* ---------------------------------------------------------------------
 * 3. Expose a resolved file URL in REST (robust for any ACF return format)
 * ------------------------------------------------------------------- */
add_action( 'rest_api_init', function () {
	register_rest_field( 'document', 'file_url', array(
		'get_callback' => function ( $obj ) {
			$file = function_exists( 'get_field' ) ? get_field( 'file', $obj['id'] ) : '';
			if ( is_string( $file ) ) {
				return $file;
			}
			if ( is_array( $file ) && ! empty( $file['url'] ) ) {
				return $file['url'];
			}
			if ( is_numeric( $file ) ) {
				return wp_get_attachment_url( $file );
			}
			return '';
		},
	) );
} );
