<?php
/**
 *defined constants
 */
define('ESTRY_CC_DS', DIRECTORY_SEPARATOR);
define('ESTRY_CC_HOME', dirname(__FILE__));
define('ESTRY_CC_ASSETS_URI', plugin_dir_url(__FILE__) . 'assets/');
define('ESTRY_CC_BACKEND_DIR', ESTRY_CC_HOME. ESTRY_CC_DS . 'estrybackend');

define('ESTRY_CC_CSS_TEXTDOMAIN', 'estry-currency-converter');
define('ESTRY_CC_INPUT_PREFIX', 'esinput');
define('ESTRY_CC_DATABASE_VALUES_PREFIX', 'ESTRY_CC');
define('ESTRY_CC_FRONTEND_FILE_DIR', ESTRY_CC_HOME . ESTRY_CC_DS . 'assets/js/frontend.js');