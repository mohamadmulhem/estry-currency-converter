<?php include ESTRY_CC_BACKEND_DIR . ESTRY_CC_DS . 'layout/parts/form-header.php'; ?>
    <h5 class="card-title">Settings</h5>
<?php

use function Estry\CurrencyConverter\Functions\view_element;

view_element('normaltextbox', $params = array(
    'label_value' => 'Api Key',
    'label_class' => '',
    'input_id' => 'iApiKey',
    'input_value' => isset($api_key) ? $api_key : '',
    'input_name' => ESTRY_CC_INPUT_PREFIX . 'apikey',
    'input_class' => 'bpost',
    'required' => false,
    'placeholder' => '',
    'auto_complete' => 'off',
    'help_text_id' => 'apikeyhelptext',
    'help_text' => 'e.g. 455be31d8c90b92410f84bd26b304e9e'
)
);
view_element('normaltextbox', $params = array(
    'label_value' => 'CSS Class of the Price HTML Element',
    'label_class' => '',
    'input_id' => 'iPriceCSSClass',
    'input_value' => isset($price_css_class) ? $price_css_class : '',
    'input_name' => ESTRY_CC_INPUT_PREFIX . 'pricecssclass',
    'input_class' => 'bpost',
    'required' => false,
    'placeholder' => '',
    'auto_complete' => 'off',
    'help_text_id' => 'price css class',
    'help_text' => 'CSS Class without the dot prefix, e.g. price-text'
)
);
view_element('selectbox', $params = array(
    'label_value' => 'Connection Type',
    'label_class' => '',
    'input_id' => 'iPrefix',
    'input_value' => $prefix,
    'input_name' => ESTRY_CC_INPUT_PREFIX . 'prefix',
    'input_class' => 'bpost',
    'required' => false,
    'placeholder' => '',
    'data' => array(
        'http' => 'Http',
        'https' => 'Https (Needs Premium Account)',
    ),
    'normalarr' => true
));
require ESTRY_CC_BACKEND_DIR . ESTRY_CC_DS . 'incl/currencies.php';

use Estry\ReadyData\CurrenciesData;

view_element('selectbox', $params = array(
    'label_value' => 'Base Currency',
    'label_class' => '',
    'input_id' => 'iBaseCurrency',
    'input_value' => isset($base_currency) ? $base_currency : '',
    'input_name' => ESTRY_CC_INPUT_PREFIX . 'basecurrency',
    'input_class' => 'bpost',
    'required' => false,
    'placeholder' => '',
    'data' => CurrenciesData::GetCurrencies(),
    'normalarr' => true
));

view_element('selectbox', $params = array(
    'label_value' => 'Secondary Currencies',
    'label_class' => '',
    'input_id' => 'iSecondaryCurrencies',
    'input_value' => $secondary_currencies,
    'input_name' => ESTRY_CC_INPUT_PREFIX . 'secondarycurrencies[]',
    'input_class' => 'bpost',
    'required' => false,
    'placeholder' => '',
    'data' => CurrenciesData::GetCurrencies(),
    'normalarr' => true,
    'multiple' => true
));
include ESTRY_CC_BACKEND_DIR . ESTRY_CC_DS . 'layout/parts/form-footer.php';

