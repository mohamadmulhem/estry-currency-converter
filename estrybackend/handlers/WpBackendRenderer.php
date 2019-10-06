<?php
namespace Estry\CurrencyConverter\Handlers;
/**
 * Class WpBackendRenderer
 * @package Estry\CurrencyConverter\Handlers
 *
 * Provides static functions for rendering front end functionality
 */
class WpBackendRenderer
{
    public function Init()
    {
        //add_action('admin_enqueue_scripts', array(__CLASS__, 'InitStyles'));
    }

    public static function InitScripts()
    {
        wp_enqueue_script(
            'estrycc-popper-js',
            ESTRY_CC_ASSETS_URI . 'bower_components/popper.js/dist/popper.min.js',
            array('jquery'),
            false,
            true);
        wp_enqueue_script(
            'estrycc-bootstrap-js',
            ESTRY_CC_ASSETS_URI . 'bower_components/bootstrap/dist/js/bootstrap.min.js',
            array('jquery'),
            false,
            true);
        wp_enqueue_script(
            'estrycc-bootstrap-multiselect-js',
            ESTRY_CC_ASSETS_URI . 'bower_components/bootstrap-multiselect/dist/js/bootstrap-multiselect.js',
            array('jquery'),
            false,
            true);
        wp_enqueue_script(
            'estrycc-backend-js',
            ESTRY_CC_ASSETS_URI . 'js/backend.js',
            array('jquery'),
            false,
            true);
    }

    public static function InitStyles()
    {
        wp_enqueue_style('estryccfr-bootstrapcss',
            ESTRY_CC_ASSETS_URI . 'bower_components/bootstrap/dist/css/bootstrap.min.css');
        wp_enqueue_style('estryccfr-bootstrap-multiselect-css',
            ESTRY_CC_ASSETS_URI . 'bower_components/bootstrap-multiselect/dist/css/bootstrap-multiselect.css');
        wp_enqueue_style('estryccfr-admin-css',
            ESTRY_CC_ASSETS_URI . 'css/admin.css');
    }
}