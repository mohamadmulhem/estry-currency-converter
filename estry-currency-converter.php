<?php
/**
	* Plugin Name: Estry Currency Converter
	* Plugin URI: https://87try.com/portal/post/15
	* Description: Beautiful currency converter as a tooltip
	* Version: 1.0.0
	* Author: Mohamad Mulhem
	* Author URI: https://mohamad-mulhem.com
*/
// Make sure we don't expose any info if called directly
if ( !function_exists( 'add_action' ) ) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit;
}
require 'config.php';
require 'estryccmaincontroller.php';
require ESTRY_CC_BACKEND_DIR . ESTRY_CC_DS . 'incl/functions.php';
require ESTRY_CC_BACKEND_DIR . ESTRY_CC_DS . 'handlers/WpBackendRenderer.php';
require ESTRY_CC_BACKEND_DIR . ESTRY_CC_DS . 'helpers/FileManager.php';
$estry_cc_mainController = new ESTRYCCMainController();
$estry_cc_mainController->Init();

