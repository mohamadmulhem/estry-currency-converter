<?php
/**
 * general functions
 */
namespace ESTRY\CurrencyConverter\Functions;

function view($page, $title = null, $data)
{
    if ($data && gettype($data) == 'array')
        extract($data);
    $page = strtolower($page);
    $view = ESTRY_CC_BACKEND_DIR . ESTRY_CC_DS . "layout/views/{$page}.view.php";
    require ESTRY_CC_BACKEND_DIR . ESTRY_CC_DS . "layout/index.php";
}

function view_part($part_name, $data = null)
{
    require $part_name . '.part.php';
}

function view_element($input, $params)
{
    extract($params);
    include ESTRY_CC_BACKEND_DIR . ESTRY_CC_DS . 'layout/elements/element.' . $input . '.php';
}


function contains_or_equals($search_string, $target_string)
{
    if (strpos($search_string, $target_string)
        || strpos($search_string, $target_string) === 0
        || $search_string == $target_string)
        return true;
    else
        return false;
}

function set_date_format($target_value)
{
    return date(CMSDATE_FORMAT, strtotime($target_value));
}

//set array key value in session key value, whether array exists or not
function set_session_arr_key($key, $arr_key, $arr_value)
{
    if (isset($_SESSION[$key]))
        $_SESSION[$key][$arr_key] = $arr_value;
    else {
        $_SESSION[$key] = array();
        $_SESSION[$key][$arr_key] = $arr_value;
    }
}

function post($param, $htmlspecchars = true)
{
    if (!isset($_POST[$param]))
        return false;
    else {
        if ($htmlspecchars)
            return htmlspecialchars(trim($_POST[$param]));
        else
            return $_POST[$param];
    }
}

function split_array_from_post($key_start)
{
    $result_array = array();
    foreach ($_POST as $key => $value) {
        if (startsWith($key, $key_start)) {
            if ($key != $key_start)
                $new_key = substr($key, strlen($key_start));
            else
                $new_key = $key;
            if (is_numeric($new_key))
                $new_key = $new_key . '#';
            if(!is_array($value))
                $result_array[$new_key] = htmlspecialchars($value);
            else
                $result_array[$new_key] = $value;
        }
    }
    return $result_array;
}

function split_array_from_get($key_start)
{
    $result_array = array();
    foreach ($_GET as $key => $value) {
        if (startsWith($key, $key_start)) {
            if ($key != $key_start)
                $new_key = substr($key, 5);
            else
                $new_key = $key;
            if (is_numeric($new_key))
                $new_key = $new_key . '#';
            $result_array[$new_key] = htmlspecialchars($value);
        }
    }
    return $result_array;
}

function startsWith($haystack, $needle)
{
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}
function dump($var, $back_button = false)
{
    var_dump($var);
    if ($back_button)
        ?>
        <a href="Javascript:window.history.back()">Back</a>
        <?php
    die();
}
