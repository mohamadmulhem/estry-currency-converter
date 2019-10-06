jQuery(document).ready(function() {
    //jQuery('#iSecondaryCurrencies').multiselect();
    jQuery('#iSecondaryCurrencies').multiselect({
        buttonClass: 'btn btn-secondary',
        templates: {
            li: '<li><a tabindex="0" class="dropdown-item"><label></label></a></li>',
        }
    });
});