<?php

/**
 * Class ESTRYCCMainController
 *
 * The main controller
 */
class ESTRYCCMainController
{
    public function Init()
    {
        add_action('admin_menu', array(__CLASS__, 'InitAdminMenu'));
        add_action('admin_enqueue_scripts', array('Estry\CurrencyConverter\Handlers\WpBackendRenderer', 'InitScripts'));
        add_action('admin_enqueue_scripts', array('Estry\CurrencyConverter\Handlers\WpBackendRenderer', 'InitStyles'));

        add_action('wp_enqueue_scripts', array(__CLASS__, 'InitFrontEndStyles'));
        add_action('wp_enqueue_scripts', array(__CLASS__, 'InitFrontEndScripts'));
    }

    public static function InitAdminMenu()
    {
        add_menu_page(
            'Estry Currency Converter',
            'Estry Currency Converter',
            'manage_options',
            'estry-currency-converter',
            array(__CLASS__, 'InitAdminBackend',
                ),
            ''
        );
    }

    public static function InitAdminBackend()
    {
        require_once dirname(__FILE__) . '/estrybackend/initialize.php';
    }

    public static function InitFrontEndScripts()
    {
        wp_enqueue_script(
            'estryccfr-curjs',
            plugins_url('assets/bower_components/currencyr/currencyr.min.js', __FILE__),
            array('jquery'),
            false,
            true);
        wp_enqueue_script(
            'estryccfr-frontendcss',
            plugins_url('assets/js/frontend.js', __FILE__),
            array('jquery'),
            false,
            true);
    }

    public static function InitFrontEndStyles()
    {
        wp_enqueue_style('estryccfr-curcss',
            plugins_url('assets/bower_components/currencyr/currencyr.css'
                , __FILE__));
        wp_enqueue_style('estryccfr-curtheme',
            plugins_url('assets/bower_components/currencyr/themes/light/light.css'
                , __FILE__));
        wp_enqueue_style('estryccfr-frontendjs',
            plugins_url('assets/css/frontend.css'
                , __FILE__));
    }

}