<?php
/**
 * Plugin Name:  Haquan — Site Pages
 * Description:  Registers the site_page CPT, site_page_category taxonomy and the "Page Content" ACF field group (home / about / support / contact). Includes 6 PDF upload slots for the Support page's technical documents. Requires the free ACF plugin.
 * Version:      1.1.0
 * Author:       Haquan
 *
 * Can also be dropped into wp-content/mu-plugins/ or pasted into functions.php.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ---------------------------------------------------------------------
 * 1. Custom Post Type: site_page
 * ------------------------------------------------------------------- */
add_action( 'init', function () {
	register_post_type( 'site_page', array(
		'labels' => array(
			'name'          => 'Site Pages',
			'singular_name' => 'Site Page',
			'menu_name'     => 'Site Pages',
			'add_new_item'  => 'Add Site Page',
			'edit_item'     => 'Edit Site Page',
			'all_items'     => 'All Site Pages',
		),
		'public'        => true,
		'show_in_rest'  => true,            // /wp-json/wp/v2/site_page
		'rest_base'     => 'site_page',
		'menu_icon'     => 'dashicons-welcome-widgets-menus',
		'menu_position' => 21,
		'has_archive'   => false,
		'hierarchical'  => false,
		'supports'      => array( 'title', 'editor', 'thumbnail' ),
	) );
} );

/* ---------------------------------------------------------------------
 * 2. Taxonomy: site_page_category  (home | about | support | contact)
 * ------------------------------------------------------------------- */
add_action( 'init', function () {
	register_taxonomy( 'site_page_category', 'site_page', array(
		'labels' => array(
			'name'          => 'Page Categories',
			'singular_name' => 'Page Category',
			'menu_name'     => 'Page Categories',
		),
		'public'            => true,
		'hierarchical'      => true,
		'show_in_rest'      => true,        // /wp-json/wp/v2/site_page_category
		'rest_base'         => 'site_page_category',
		'show_admin_column' => true,
	) );

	// Seed the four fixed terms once.
	$terms = array(
		'home'    => 'Home',
		'about'   => 'About',
		'support' => 'Support',
		'contact' => 'Contact',
	);
	foreach ( $terms as $slug => $name ) {
		if ( ! term_exists( $slug, 'site_page_category' ) ) {
			wp_insert_term( $name, 'site_page_category', array( 'slug' => $slug ) );
		}
	}
} );

/* ---------------------------------------------------------------------
 * 3. ACF field group: "Page Content"  (attached only to site_page)
 *    Field types kept to Text, Image, Gallery, URL, Textarea.
 * ------------------------------------------------------------------- */
add_action( 'acf/init', function () {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	acf_add_local_field_group( array(
		'key'          => 'group_site_page_content',
		'title'        => 'Page Content',
		'show_in_rest' => 1,                // expose ACF in REST (critical for Next.js)
		'location'     => array(
			array(
				array(
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'site_page',
				),
			),
		),
		'menu_order'      => 0,
		'position'        => 'normal',
		'label_placement' => 'top',
		'fields' => array(

			/* ---- Shared (all pages) ---- */
			array( 'key' => 'field_sp_subtitle',   'label' => 'Subtitle',   'name' => 'subtitle',   'type' => 'text' ),
			array( 'key' => 'field_sp_hero_image',  'label' => 'Hero Image', 'name' => 'hero_image', 'type' => 'image', 'return_format' => 'url', 'preview_size' => 'medium' ),
			array( 'key' => 'field_sp_cta_text',    'label' => 'CTA Text',   'name' => 'cta_text',   'type' => 'text' ),
			array( 'key' => 'field_sp_cta_link',    'label' => 'CTA Link',   'name' => 'cta_link',   'type' => 'url' ),

			/* ---- Home ---- */
			array( 'key' => 'field_sp_adv1_title', 'label' => 'Home · Advantage 1 Title', 'name' => 'advantage_1_title', 'type' => 'text' ),
			array( 'key' => 'field_sp_adv1_desc',  'label' => 'Home · Advantage 1 Desc',  'name' => 'advantage_1_desc',  'type' => 'textarea', 'rows' => 3 ),
			array( 'key' => 'field_sp_adv2_title', 'label' => 'Home · Advantage 2 Title', 'name' => 'advantage_2_title', 'type' => 'text' ),
			array( 'key' => 'field_sp_adv2_desc',  'label' => 'Home · Advantage 2 Desc',  'name' => 'advantage_2_desc',  'type' => 'textarea', 'rows' => 3 ),
			array( 'key' => 'field_sp_adv3_title', 'label' => 'Home · Advantage 3 Title', 'name' => 'advantage_3_title', 'type' => 'text' ),
			array( 'key' => 'field_sp_adv3_desc',  'label' => 'Home · Advantage 3 Desc',  'name' => 'advantage_3_desc',  'type' => 'textarea', 'rows' => 3 ),
			array( 'key' => 'field_sp_trust',      'label' => 'Home · Trust Bar Text',    'name' => 'trust_bar_text',    'type' => 'text' ),

			/* ---- About ---- */
			array( 'key' => 'field_sp_mission', 'label' => 'About · Mission', 'name' => 'mission_text', 'type' => 'textarea', 'rows' => 3 ),
			array( 'key' => 'field_sp_story',   'label' => 'About · Story',   'name' => 'story_text',   'type' => 'textarea', 'rows' => 6 ),
			array( 'key' => 'field_sp_gallery', 'label' => 'About · Factory Gallery', 'name' => 'factory_gallery', 'type' => 'gallery', 'return_format' => 'url' ), // Gallery requires ACF PRO

			/* ---- Support ---- */
			array( 'key' => 'field_sp_faq1_q', 'label' => 'Support · FAQ 1 Question', 'name' => 'faq_1_question', 'type' => 'text' ),
			array( 'key' => 'field_sp_faq1_a', 'label' => 'Support · FAQ 1 Answer',   'name' => 'faq_1_answer',   'type' => 'textarea', 'rows' => 3 ),
			array( 'key' => 'field_sp_faq2_q', 'label' => 'Support · FAQ 2 Question', 'name' => 'faq_2_question', 'type' => 'text' ),
			array( 'key' => 'field_sp_faq2_a', 'label' => 'Support · FAQ 2 Answer',   'name' => 'faq_2_answer',   'type' => 'textarea', 'rows' => 3 ),

			/* Support · Downloadable PDFs — upload your real documents here.
			   Each slot maps to a card on the Support page; empty slots are hidden. */
			array( 'key' => 'field_sp_doc1', 'label' => 'Support · Doc 1 — General Product Catalogue (PDF)',        'name' => 'doc_1_file', 'type' => 'file', 'return_format' => 'url', 'mime_types' => 'pdf' ),
			array( 'key' => 'field_sp_doc2', 'label' => 'Support · Doc 2 — Sewage & Grinder Pump Curves (PDF)',      'name' => 'doc_2_file', 'type' => 'file', 'return_format' => 'url', 'mime_types' => 'pdf' ),
			array( 'key' => 'field_sp_doc3', 'label' => 'Support · Doc 3 — AODD (QBY) Selection Guide (PDF)',        'name' => 'doc_3_file', 'type' => 'file', 'return_format' => 'url', 'mime_types' => 'pdf' ),
			array( 'key' => 'field_sp_doc4', 'label' => 'Support · Doc 4 — Pipeline Centrifugal Datasheet (PDF)',    'name' => 'doc_4_file', 'type' => 'file', 'return_format' => 'url', 'mime_types' => 'pdf' ),
			array( 'key' => 'field_sp_doc5', 'label' => 'Support · Doc 5 — Installation & Maintenance Manual (PDF)', 'name' => 'doc_5_file', 'type' => 'file', 'return_format' => 'url', 'mime_types' => 'pdf' ),
			array( 'key' => 'field_sp_doc6', 'label' => 'Support · Doc 6 — Material & Coating Reference (PDF)',       'name' => 'doc_6_file', 'type' => 'file', 'return_format' => 'url', 'mime_types' => 'pdf' ),

			/* ---- Contact ---- */
			array( 'key' => 'field_sp_address', 'label' => 'Contact · Address', 'name' => 'address_en', 'type' => 'textarea', 'rows' => 3 ),
			array( 'key' => 'field_sp_phone',   'label' => 'Contact · Phone',   'name' => 'phone',      'type' => 'text', 'default_value' => '+86 150 0057 7161' ),
			array( 'key' => 'field_sp_email',   'label' => 'Contact · Email',   'name' => 'email',      'type' => 'text', 'default_value' => 'sales@haquanpump.com' ),
			array( 'key' => 'field_sp_map',     'label' => 'Contact · Google Map Embed', 'name' => 'map_embed_code', 'type' => 'textarea', 'rows' => 4 ),
		),
	) );
} );
