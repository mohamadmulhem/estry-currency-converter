(function ($) {
    $(document).ready(function () {
        // Dynamic initialization, currency data from Open Exchange Rates
        var appId = 'fb981ca428208a5068de8a1058c3c8b8';
        $.getJSON('http://data.fixer.io/api/symbols?access_key=' + appId, function (response) {
            var currencies = response.symbols;
            $.getJSON('http://data.fixer.io/api/latest?access_key=' + appId + '&base=EUR', {}, function (response) {
                $.currencyr(currencies, response.base, {
                    AOA: response.rates.AOA
                });
                $('.price').currencyr({remember: false});
            });
        });
        //tippy('.currency-icon', {trigger: 'click'});

    });
})(jQuery);