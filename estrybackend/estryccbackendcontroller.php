<?php
//use classes
use Estry\CurrencyConverter\Helpers\FileManager;
//use functions
use function Estry\CurrencyConverter\Functions\view;
use function Estry\CurrencyConverter\Functions\view_element;
use function Estry\CurrencyConverter\Functions\split_array_from_post;

/**
 * Class EstryCCBackendController
 *
 * The backend controller
 */
class EstryCCBackendController
{
    //view name to import like: settings, will be imported like settings.view.php
    private $View = 'settings';
    private $ApiKey_Key = ESTRY_CC_DATABASE_VALUES_PREFIX . 'apikey';
    private $PriceCSSClass_Key = ESTRY_CC_DATABASE_VALUES_PREFIX . 'pricecssclass';
    private $BaseCurrency_Key = ESTRY_CC_DATABASE_VALUES_PREFIX . 'basecurrency';
    private $SecondaryCurrencies_Key = ESTRY_CC_DATABASE_VALUES_PREFIX . 'secondarycurrencies';
    private $Prefix_Key = ESTRY_CC_DATABASE_VALUES_PREFIX . 'prefix';

    public function Process()
    {
        if (count($_POST) > 0 || count($_FILES) > 0) {
            $this->ProcessSubmitted();
        } else {
            $this->ProcessNormal();
        }
    }

    private function ProcessNormal()
    {
        $data = array();
        $data['api_key'] = get_option($this->ApiKey_Key);
        $data['price_css_class'] = get_option($this->PriceCSSClass_Key);
        $data['base_currency'] = get_option($this->BaseCurrency_Key);
        $data['prefix'] = get_option($this->Prefix_Key);
        $secondary_currencies_raw_array = explode(',', get_option($this->SecondaryCurrencies_Key));
        $secondary_currencies_array = array();
        for ($i = 0; $i < count($secondary_currencies_raw_array); $i++) {
            $secondary_currencies_array[] = trim(explode(':', $secondary_currencies_raw_array[$i])[0]);
        }
        $data['secondary_currencies'] = $secondary_currencies_array;
        $this->SetView($data);
    }

    private function ProcessSubmitted()
    {
        $record_params = split_array_from_post(ESTRY_CC_INPUT_PREFIX);
        $api_key = $record_params['apikey'];
        $price_css_class = $record_params['pricecssclass'];
        $base_currency = $record_params['basecurrency'];
        $prefix = $record_params['prefix'];
        $secondary_currencies_array = $record_params['secondarycurrencies'];
        $secondary_currencies = '';
        for ($i = 0; $i < count($secondary_currencies_array); $i++) {
            $secondary_currencies = $secondary_currencies . $secondary_currencies_array[$i] . ': response.rates.' . $secondary_currencies_array[$i];
            if ($i != count($secondary_currencies_array) - 1)
                $secondary_currencies = $secondary_currencies . ', ';
        }
        update_option($this->ApiKey_Key, $api_key);
        update_option($this->PriceCSSClass_Key, $price_css_class);
        update_option($this->BaseCurrency_Key, $base_currency);
        update_option($this->SecondaryCurrencies_Key, $secondary_currencies);
        update_option($this->Prefix_Key, $prefix);
        $fileManager = new FileManager();
        $required_code_text = $fileManager->GetContent(ESTRY_CC_FRONTEND_FILE_DIR . '.bk');
        $fileManager->Write2File(ESTRY_CC_FRONTEND_FILE_DIR, strtr(
            $required_code_text,
            array(
                '{$apikey}' => $api_key,
                '{$cssclass}' => $price_css_class,
                '{$basecurrency}' => $base_currency,
                '{$secondarycurrencies}' => $secondary_currencies,
                '{$prefix}' => $prefix
            )
        ));
        $data = array(
            'api_key' => $api_key,
            'price_css_class' => $price_css_class,
            'base_currency' => $base_currency,
            'secondary_currencies' => $secondary_currencies_array,
            'prefix' => $prefix,
            'response_message' => 'The settings have been successfully saved'
        );
        //$this->HandleSubmitResult('success');
        $this->SetView($data);
    }

    private function SetView($data = null)
    {
        view($this->View, null, $data);
    }

    private function HandleSubmitResult($result)
    {
        //printing the result is important as a response to ajax
        echo json_encode($result);
    }
}