/*****************************************
  _____
 / ___/_ _____________ ___  ______ ______
/ /__/ // / __/ __/ -_) _ \/ __/ // / __/
\___/\_,_/_/ /_/  \__/_//_/\__/\_, /_/
                              /___/

*****************************************/
/*!
 * Currencyr 1.0 - jQuery currency converter plugin
 * http://adivalabs.com/jquery/currencyr
 * http://firmanw.github.com/jquery-currencyr
 *
 * Copyright 2012, Firman Wandayandi (adivalabs.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/MIT
 * http://opensource.org/licenses/GPL-2.0
 *
 * Includes accounting.js
 * http://josscrowcroft.github.com/accounting.js/
 * Copyright 2011, Joss Crowcroft
 *
 * Includes jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 * Copyright 2011, Klaus Hartl
 */

( function( $ ) {

    // Set the data, must be called before the plugin function
    $.currencyr = function( currencies, base, rates ) {
        var data = {
            currencies : currencies,
            base       : base.toUpperCase(),
            rates      : rates
        };

        $( 'body' ).data( 'currencyr_data', data );
    }

    var Currencyr = function( target, options )
    {
        this.target = target;
        this.options = $.extend( {}, this.defaults, options );

        this.init();

        return this;
    };

    Currencyr.prototype =
    {
        // jQuery object of target collection
        target: null,

        // Default options
        defaults: {
            'root'      : 'currencyr',  // An Id of root container without "#"
            'numcodes'  : 5,            // How many codes of dropdown size
            'pad'       : 20,           // Number of space of dialog with current target in pixels
            'currency'  : null,         // Default currency,
            'thousand'  : ',',          // Thousands separator
            'decimal'   : '.',          // Decimal point separator
            'precision' : 2             // Decimal places
        },

        // Currency data
        data: {
            'base'       : '',
            'currencies' : {},
            'rates'      : {}
        },

        // Current active target
        current: null,

        // Amount of current active conversion
        amount: 0,

        // CSS classes of elements
        classes: {
            'container'    : 'container',
            'close-button' : 'close',
            'converter'    : 'converter',
            'amount'       : 'amount',
            'code'         : 'code',
            'currency'     : 'currency',
            'codes'        : 'codes',
            'dropdown'     : 'dropdown',
            'target'       : 'target'
        },

        // Collection of dialog components
        elements: {},

        // Dimension of dialog components
        dimensions: {
            'main'     : 0,
            'dropdown' : 0,
            'total'    : 0
        },

        // Dialog popup direction
        direction: 'bottom',

        /**
         * Initialization
         */
        init: function()
        {
            if ( !this.prepare() ) return;

            accounting.settings.currency = $.extend( accounting.settings.currency, {
                'thousand'  : this.options.thousand,
                'decimal'   : this.options.decimal,
                'precision' : this.options.precision
            } );

            this.build();
            this.setDimensions();
            this.setEvents();
        },

        /**
         * Preparation
         */
        prepare: function()
        {
            if ( !$( 'body' ).data( 'currencyr_data' ) ) return false;

            this.data = $( 'body' ).data( 'currencyr_data' );
            return true;
        },

        /**
         * CSS classes with namespace
         */
        cssClass: function(element)
        {
            return this.options.root + '-' + (this.classes[element] || element);
        },

        /**
         * Build the dialog components
         */
        build: function()
        {
            var self = this,
                $converter;

            // Singleton build
            if ( $('#' + self.options.root).length > 0 ) return;

            // Root
            self.elements['root'] = $('<div />').attr( 'id', self.options.root ).addClass('currencyr').hide();
            self.elements['root'].appendTo('body');

            // Container
            self.elements['container'] = $('<div />').addClass( self.cssClass('container') );
            self.elements['container'].appendTo( self.elements['root'] );

            self.elements['beak'] = $('<div />').addClass( self.cssClass('beak') );
            self.elements['beak'].appendTo( self.elements['container'] );

            // Close button
            self.elements['close-button'] = $('<div />').addClass( self.cssClass('close-button') );
            self.elements['close-button'].appendTo( self.elements['container'] );

            // Converter wrapper
            self.elements['converter'] = $('<div />').addClass( self.cssClass('converter') );
            self.elements['converter'].appendTo( self.elements['container'] );

            $converter = $('<div class="currencyr-converter-content" />');
            $converter.appendTo( self.elements['converter'] );

            // Amount
            self.elements['amount'] = $('<div />').addClass( self.cssClass('amount') );
            self.elements['amount'].appendTo( $converter );

            // Code wrapper
            self.elements['code'] = $('<div />').addClass( self.cssClass('code') );
            self.elements['code'].appendTo( $converter );

            // Dropdown toggle
            self.elements['currency-toggle'] = $('<div />').addClass( self.cssClass('toggle') );
            self.elements['currency-toggle'].appendTo( self.elements['code'] );

            // Selected currency
            self.elements['currency'] = $('<span />').addClass( self.cssClass('currency') ).text( self.data.base );
            self.elements['currency'].appendTo( self.elements['code'] );

            // Dropdown container
            self.elements['codes'] = $('<div />').addClass( self.cssClass('codes') );
            self.elements['codes'].appendTo( self.elements['code'] );

            // Dropdown wrapper
            self.elements['dropdown'] = $('<div />').addClass( self.cssClass('dropdown') );
            self.elements['dropdown'].appendTo( self.elements['codes'] );

            // Dropdown list
            self.elements['codes-list'] = $('<ul />');
            self.elements['codes-list'].appendTo( self.elements['dropdown'] );
            $.each( self.data.rates, function( code, rate ) {
                self.elements['codes-list'].append( '<li>' + code + '<span>' + self.data.currencies[code] + '</span></li>' );
            });

            self.elements['remember'] = $('<div />').addClass( self.cssClass( 'remember' ) );
            self.elements['remember'].appendTo( self.elements['container'] );
            self.elements['remember'].html('<label><input type="checkbox"> Remember</label>');

            // Enclosure (decoration)
            $('<div class="currencyr-enclosure-top" />').prependTo( self.elements['codes'] );
            $('<div class="currencyr-enclosure-bottom" />').prependTo( self.elements['codes'] );

            // Hide it
            self.elements['root'].hide();
        },

        /**
         * Mostly discovering the dimensions of components and save it into collection
         */
        setDimensions: function()
        {
            var self          = this,
                currencywidth = 0;

            // Set the display to while keep it hiding to get the right dimension of item inside
            self.elements['root'].css( { visibility: 'hidden', display: 'block' } );
            self.elements['codes'].css( { visibility: 'hidden', display: 'block' } );

            // Gets the max width of codes to justify the dropdown
            $( 'li', self.elements['codes-list'] ).each(function() {
                currencywidth = Math.max( currencywidth, $(this).width() );
            });

            // Set the dropdown dimension
            self.elements['dropdown'].css({
                height: $( 'li', self.elements['codes-list'] ).first().outerHeight() * Math.min( $( 'li', self.elements['codes-list'] ).length, self.options.numcodes )
            });

            // Save the dimensions for later
            self.dimensions['main'] = {
              width: self.elements['root'].width(),
              height: self.elements['root'].height()
            };
            self.dimensions['converter'] = {
              width: self.elements['converter'].width(),
              height: self.elements['converter'].height()
            };
            self.dimensions['currency'] = {
              width: currencywidth + self.elements['currency-toggle'].width(),
              height: self.elements['currency'].outerHeight()
            };
            self.dimensions['dropdown'] = {
              width: self.elements['dropdown'].width(),
              height: self.elements['dropdown'].height()
            };
            self.dimensions['dialog'] = {
              width: self.elements['root'].width(),
              height: ( self.dimensions['main'].height + self.dimensions['dropdown'].height )
            };

            // Adjust the components dinamically
            self.elements['currency'].width( self.dimensions['currency'].width );
            self.elements['currency-toggle'].css( { right: ( self.elements['codes-list'].width() - currencywidth ) / 2 } );
            self.elements['amount'].css( { marginRight: self.dimensions['currency'].width + ( self.elements['currency'].outerWidth() - self.dimensions['currency'].width ) } );
            $('li', self.elements['codes-list']).width( self.dimensions['currency'].width );
            self.elements['dropdown'].css( { width: self.elements['codes-list'].outerWidth() } );

            // Reset back to the current state
            self.elements['codes'].css( { visibility: '', display: 'none' } );
            self.elements['root'].css( { visibility: '', display: 'none' } );
        },

        /**
         * Setting up the events
         */
        setEvents: function()
        {
            var self = this;

            // Amount elements
            $(self.target).click(function() {
                self.show(this);
            });

            // Close events
            $('html').add( self.elements['close-button'] ).click( function() {
                self.close();
            } );
            $('#' + self.options.root).add( self.target ).click( function(e) {
                e.stopPropagation();
            } );

            // Override CSS hover event while keep the CSS fallback
            self.elements['code'].mouseover( function() {
                self.elements['codes'].hide();
            } ).unbind( 'mouseover' );

            // Codes dropdown event
            self.elements['currency'].click( function() {
                self.dropdown();
            } );

            // Currency list
            $( 'li', self.elements['codes'] ).click( function() {
                var c = $( this ).clone();
                $( 'span', c ).remove();

                self.exchange( c.text() );
            } ).hover(
                function() { self.dropdownOver( this ); },
                function() { self.dropdownOut( this ); }
            );

            $( window ).bind( 'resize scroll', function() {
                if ( self.current == null ) return;

                var offset = self.current.offset(),
                    height = self.current.height(),
                    beak = self.elements['beak'].height() + 2,
                    yp = ( offset.top - $( window ).scrollTop() ) + height + beak,
                    ypad = yp;

                if ( self.direction == 'top' )
                {
                    yp = ( offset.top - $(window).scrollTop() ) - self.dimensions['main'].height - beak;
                    ypad = yp;
                }

                self.elements['root'].css( {
                    left: ( offset.left - $( window ).scrollLeft() ) - Math.min( self.elements['beak'].width(), self.current.outerWidth() / 2 ),
                    top: ypad
                } );
            } );

            // Bind the handler to mouse wheel event
            if ( window.addEventListener ) {
                // Firefox 17.0 (Gecko 17.0)
                self.elements['dropdown'][0].addEventListener( 'wheel', self.dropdownWheel, false );

                // Firefox 3.5 (Gecko 1.9.1) [Deprecated]
                self.elements['dropdown'][0].addEventListener( 'MozMousePixelScroll', self.dropdownWheel, false );

                // IE & WebKit
                self.elements['dropdown'][0].addEventListener( 'mousewheel', self.dropdownWheel, false );
            }

            $( 'input[type="checkbox"]', self.elements['remember'] ).unbind().bind( 'click', function() {
                self.remember( $(this).attr('checked'), self.elements['currency'].text() );
            } );
        },

        /**
         * Show the dialog
         */
        show: function( target )
        {
            var self   = this,
                base   = self.data.base,
                amount = 0,
                offset = $( target ).offset(),
                height = $( target ).height(),
                vp     = self.viewport(),
                beak   = self.elements['beak'].height() + 2,
                yp     = ( offset.top - $( window ).scrollTop() ) + height + beak,
                ypad   = yp + self.options.pad;

            self.current = $(target);

            if (yp + self.dimensions['dialog'].height > vp.height) self.direction = 'top';
            else self.direction = 'bottom';

            $('*').removeClass( self.cssClass('target') );
            $(target).addClass( self.cssClass('target') );

            if ( $.cookie('currencyr') != null ) {
                base = $.cookie('currencyr');
                $( 'input[type="checkbox"]', self.elements['remember'] ).attr( 'checked', true );
            } else if ( self.options.currency != null ) {
                base = self.options.currency;
            }

            // Set the currency
            self.elements['currency'].text( base );
            self.elements['code'].removeClass( this.cssClass( 'dropped' ) );

            // Set the amount according the target
            self.amount = accounting.unformat( $( target ).text() );
            amount = base != self.data.base ? accounting.formatMoney( self.convert( base ), '' ) : self.amount;
            self.elements['amount'].text( amount );

            // Hide the codes
            self.elements['codes'].show().hide();

            // Show the Currencyr
            if (self.direction == 'top') {
                yp = offset.top - $(window).scrollTop() - self.dimensions['main'].height - beak;
                ypad = yp - self.options.pad;

                self.elements['container'].addClass( self.cssClass( 'direction-top' ) );
                self.elements['beak'].css( { top: 'auto', bottom: self.elements['beak'].height() * -1 } );
                self.elements['codes'].css( { height: 0, top: 0 } );
                self.elements['dropdown'].css( { top: -1 } );
            } else {
                self.elements['container'].removeClass( self.cssClass( 'direction-top' ) );
                self.elements['beak'].css( { top: self.elements['beak'].height() * -1, bottom: 'auto' } );
                self.elements['codes'].css( { top: self.dimensions['converter'].height, height: 'auto' } );
                self.elements['dropdown'].css( { top: '' } );
            }

            // Set the beak position
            self.elements['beak'].css('left', Math.min( self.elements['beak'].width(), $(target).outerWidth() / 2 ) );

            // Finally show the dialog
            self.elements['root']
                .hide()
                .css({
                    opacity: 0,
                    left: ( offset.left - $(window).scrollLeft() ) - Math.min( self.elements['beak'].width(), $( target ).outerWidth() / 2),
                    top: ypad
                })
                .show()
                .animate( { top: yp, opacity: 1 } );
        },

        /**
         * Close the dialog
         */
        close: function()
        {
            this.elements['root'].fadeOut();
            $('*').removeClass( this.cssClass( 'target' ) );

            this.current = null;
        },

        /**
         * Dropdown click callback
         */
        dropdown: function()
        {
            var self = this;

            if ( this.direction == 'top' ) {
                if ( this.elements['codes'].css( 'display' ) == 'none' ) { // slide up
                    this.elements['codes'].show().animate( {
                        top: self.dimensions['dropdown'].height * -1, height: self.dimensions['dropdown'].height
                    } );
                } else { // slide down
                    this.elements['codes'].animate( { top: 0, height: 0 }, function() {
                        $(this).hide();
                        self.elements['codes-list'].css('top', 0);
                    } );
              }
            } else {
              if ( this.elements['codes'].css( 'display' ) == 'none') {
                  this.elements['codes-list'].css( 'top', 0 );
                  this.elements['codes'].slideDown();
              } else {
                  this.elements['codes'].slideToggle();
              }
            }

            this.elements['code'].toggleClass( this.cssClass( 'dropped' ) );
        },

        /**
         * Show the currency description on mouse over
         */
        dropdownOver: function( item )
        {
            this.elements['dropdown'].width( this.elements['codes-list'].outerWidth() + $( 'span', item ).outerWidth() );
        },

        /**
         * Hide the currency description on mouse over
         */
        dropdownOut: function( item )
        {
            this.elements['dropdown'].width( this.elements['codes-list'].outerWidth() );
        },

        /**
         * Dropdown mousewheel event callback
         */
        dropdownWheel: function( e )
        {
            // this = jQuery object of codes selector
            var e   = e || window.event,
                delta   = e.wheelDelta ? e.wheelDelta / 120 : -e.deltaY || -e.detail,
                scroll  = $( this ).data( 'scroll' ) || 0,
                liH     = $( 'ul', this ).height(),
                vwH     = $( this ).height();

            // Calculate the scroll size
            scroll -= Math.ceil( delta ) * $( 'ul li', this ).first().outerHeight();
            scroll = Math.min( liH - vwH, Math.max( 0, scroll ) );

            // Save to object
            $(this).data( 'scroll', scroll );

            // Set the top position of codes list
            $('ul', this).css( 'top', -scroll );

            // Lock the window scroll
            e = $.event.fix( e );
            e.preventDefault();
        },

        /**
         * Exchange conversion
         */
        exchange: function( code )
        {
            if ( this.elements['currency'].text() == code) return;

            var self = this,
                $currencyclone = self.elements['currency'].clone(),
                $amountclone;

            self.elements['currency'].hide().text(code).css( { opacity: 0 } );

            if ( self.direction == 'top' )
            {
                self.elements['currency'].after($currencyclone);
                $currencyclone.animate( {
                      marginTop: -$currencyclone.outerHeight(),
                      opacity: 0
                  },
                  'fast',
                  function() {
                      self.elements['currency'].css({marginTop: -$(this).outerHeight()}).show().animate({
                            marginTop: 0, opacity: 1
                        },
                        'fast',
                        function() {
                            $currencyclone.remove();
                            $(this).css( { marginTop: '' } );
                        } );
                  } );
            }
            else
            {
                self.elements['currency'].before( $currencyclone );
                $currencyclone.animate( {
                      top: $currencyclone.outerHeight(), opacity: 0
                  },
                  'fast',
                  function() {
                      self.elements['currency'].show().animate( {
                          top: -$(this).outerHeight(), opacity: 1
                      },
                      'fast',
                      function() {
                          $currencyclone.remove();
                          $(this).css({top: ''});
                      } );
                  } );
            }

            // Clone the amount
            $amountclone = self.elements['amount'].clone();
            $amountclone.css( { position: 'relative' } );

            self.elements['amount'].hide().css( { opacity: 0 } );
            self.elements['amount'].before( $amountclone );
            $amountclone.animate( {
                  left: -$amountclone.outerWidth(), opacity: 0
              },
              'fast',
              function() {
                  $(this).remove();
                  self.elements['amount'].text( accounting.formatMoney( self.convert( code ), '' ) )
                    .css( { position: 'relative', left: -self.elements['amount'].outerWidth() } )
                    .show()
                    .animate( { left: 0, opacity: 1 }, 'fast' );
            } );

            // Set the remember
            self.remember( $( 'input[type="checkbox"]', self.elements['remember'] ).attr('checked'), code );
        },

        /**
         * Convert the amount
         */
        convert: function( to )
        {
            return this.amount * this.data.rates[to];
        },

        /**
         * Remember the selection
         */
        remember: function( checked, code )
        {

            if ( checked ) $.cookie( 'currencyr', code );
            else $.removeCookie( 'currencyr' );
        },

        /**
         * Get the viewport dimension
         */
        viewport: function()
        {
            return {
                width: window.innerWidth || document.documentElement.clientWidth,
                height: window.innerHeight || document.documentElement.clientHeight
            };
        }
    };

    /**
     * Plug it in
     */
    $.fn.currencyr = function( arg ) {
        var instance = $('body').data('currencyr') || {};

        if ( instance[arg] ) { // method call
            return instance[arg].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        } else if ( typeof arg === 'object' || !arg ) { // initiate
            // singleton
            if ( !$('body').data( 'currencyr' ) ) $( 'body' ).data( 'currencyr', new Currencyr( this, arg ) );

            if ( !$( this ).data( 'currencyr') ) $(this).data( 'currencyr', $( 'body' ).data( 'currencyr' ) );

            return $( 'body' ).data( 'currencyr' );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.Currencyr' );
        }
    };

} )( jQuery );


/*!
 * accounting.js v0.3.2
 * Copyright 2011, Joss Crowcroft
 *
 * Freely distributable under the MIT license.
 * Portions of accounting.js are inspired or borrowed from underscore.js
 *
 * Full details and documentation:
 * http://josscrowcroft.github.com/accounting.js/
 */

(function(root, undefined) {

	/* --- Setup --- */

	// Create the local library object, to be exported or referenced globally later
	var lib = {};

	// Current version
	lib.version = '0.3.2';


	/* --- Exposed settings --- */

	// The library's settings configuration object. Contains default parameters for
	// currency and number formatting
	lib.settings = {
		currency: {
			symbol : "$",		// default currency symbol is '$'
			format : "%s%v",	// controls output: %s = symbol, %v = value (can be object, see docs)
			decimal : ".",		// decimal point separator
			thousand : ",",		// thousands separator
			precision : 2,		// decimal places
			grouping : 3		// digit grouping (not implemented yet)
		},
		number: {
			precision : 0,		// default precision on numbers is 0
			grouping : 3,		// digit grouping (not implemented yet)
			thousand : ",",
			decimal : "."
		}
	};


	/* --- Internal Helper Methods --- */

	// Store reference to possibly-available ECMAScript 5 methods for later
	var nativeMap = Array.prototype.map,
		nativeIsArray = Array.isArray,
		toString = Object.prototype.toString;

	/**
	 * Tests whether supplied parameter is a string
	 * from underscore.js
	 */
	function isString(obj) {
		return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
	}

	/**
	 * Tests whether supplied parameter is a string
	 * from underscore.js, delegates to ECMA5's native Array.isArray
	 */
	function isArray(obj) {
		return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';
	}

	/**
	 * Tests whether supplied parameter is a true object
	 */
	function isObject(obj) {
		return obj && toString.call(obj) === '[object Object]';
	}

	/**
	 * Extends an object with a defaults object, similar to underscore's _.defaults
	 *
	 * Used for abstracting parameter handling from API methods
	 */
	function defaults(object, defs) {
		var key;
		object = object || {};
		defs = defs || {};
		// Iterate over object non-prototype properties:
		for (key in defs) {
			if (defs.hasOwnProperty(key)) {
				// Replace values with defaults only if undefined (allow empty/zero values):
				if (object[key] == null) object[key] = defs[key];
			}
		}
		return object;
	}

	/**
	 * Implementation of `Array.map()` for iteration loops
	 *
	 * Returns a new Array as a result of calling `iterator` on each array value.
	 * Defers to native Array.map if available
	 */
	function map(obj, iterator, context) {
		var results = [], i, j;

		if (!obj) return results;

		// Use native .map method if it exists:
		if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);

		// Fallback for native .map:
		for (i = 0, j = obj.length; i < j; i++ ) {
			results[i] = iterator.call(context, obj[i], i, obj);
		}
		return results;
	}

	/**
	 * Check and normalise the value of precision (must be positive integer)
	 */
	function checkPrecision(val, base) {
		val = Math.round(Math.abs(val));
		return isNaN(val)? base : val;
	}


	/**
	 * Parses a format string or object and returns format obj for use in rendering
	 *
	 * `format` is either a string with the default (positive) format, or object
	 * containing `pos` (required), `neg` and `zero` values (or a function returning
	 * either a string or object)
	 *
	 * Either string or format.pos must contain "%v" (value) to be valid
	 */
	function checkCurrencyFormat(format) {
		var defaults = lib.settings.currency.format;

		// Allow function as format parameter (should return string or object):
		if ( typeof format === "function" ) format = format();

		// Format can be a string, in which case `value` ("%v") must be present:
		if ( isString( format ) && format.match("%v") ) {

			// Create and return positive, negative and zero formats:
			return {
				pos : format,
				neg : format.replace("-", "").replace("%v", "-%v"),
				zero : format
			};

		// If no format, or object is missing valid positive value, use defaults:
		} else if ( !format || !format.pos || !format.pos.match("%v") ) {

			// If defaults is a string, casts it to an object for faster checking next time:
			return ( !isString( defaults ) ) ? defaults : lib.settings.currency.format = {
				pos : defaults,
				neg : defaults.replace("%v", "-%v"),
				zero : defaults
			};

		}
		// Otherwise, assume format was fine:
		return format;
	}


	/* --- API Methods --- */

	/**
	 * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value
	 * alias: accounting.`parse(string)`
	 *
	 * Decimal must be included in the regular expression to match floats (defaults to
	 * accounting.settings.number.decimal), so if the number uses a non-standard decimal
	 * separator, provide it as the second argument.
	 *
	 * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)
	 *
	 * Doesn't throw any errors (`NaN`s become 0) but this may change in future
	 */
	var unformat = lib.unformat = lib.parse = function(value, decimal) {
		// Recursively unformat arrays:
		if (isArray(value)) {
			return map(value, function(val) {
				return unformat(val, decimal);
			});
		}

		// Fails silently (need decent errors):
		value = value || 0;

		// Return the value as-is if it's already a number:
		if (typeof value === "number") return value;

		// Default decimal point comes from settings, but could be set to eg. "," in opts:
		decimal = decimal || lib.settings.number.decimal;

		 // Build regex to strip out everything except digits, decimal point and minus sign:
		var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),
			unformatted = parseFloat(
				("" + value)
				.replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives
				.replace(regex, '')         // strip out any cruft
				.replace(decimal, '.')      // make sure decimal point is standard
			);

		// This will fail silently which may cause trouble, let's wait and see:
		return !isNaN(unformatted) ? unformatted : 0;
	};


	/**
	 * Implementation of toFixed() that treats floats more like decimals
	 *
	 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present
	 * problems for accounting- and finance-related software.
	 */
	var toFixed = lib.toFixed = function(value, precision) {
		precision = checkPrecision(precision, lib.settings.number.precision);
		var power = Math.pow(10, precision);

		// Multiply up by precision, round accurately, then divide and use native toFixed():
		return (Math.round(lib.unformat(value) * power) / power).toFixed(precision);
	};


	/**
	 * Format a number, with comma-separated thousands and custom precision/decimal places
	 *
	 * Localise by overriding the precision and thousand / decimal separators
	 * 2nd parameter `precision` can be an object matching `settings.number`
	 */
	var formatNumber = lib.formatNumber = function(number, precision, thousand, decimal) {
		// Resursively format arrays:
		if (isArray(number)) {
			return map(number, function(val) {
				return formatNumber(val, precision, thousand, decimal);
			});
		}

		// Clean up number:
		number = unformat(number);

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(precision) ? precision : {
					precision : precision,
					thousand : thousand,
					decimal : decimal
				}),
				lib.settings.number
			),

			// Clean up precision
			usePrecision = checkPrecision(opts.precision),

			// Do some calc:
			negative = number < 0 ? "-" : "",
			base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",
			mod = base.length > 3 ? base.length % 3 : 0;

		// Format the number:
		return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
	};


	/**
	 * Format a number into currency
	 *
	 * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)
	 * defaults: (0, "$", 2, ",", ".", "%s%v")
	 *
	 * Localise by overriding the symbol, precision, thousand / decimal separators and format
	 * Second param can be an object matching `settings.currency` which is the easiest way.
	 *
	 * To do: tidy up the parameters
	 */
	var formatMoney = lib.formatMoney = function(number, symbol, precision, thousand, decimal, format) {
		// Resursively format arrays:
		if (isArray(number)) {
			return map(number, function(val){
				return formatMoney(val, symbol, precision, thousand, decimal, format);
			});
		}

		// Clean up number:
		number = unformat(number);

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(symbol) ? symbol : {
					symbol : symbol,
					precision : precision,
					thousand : thousand,
					decimal : decimal,
					format : format
				}),
				lib.settings.currency
			),

			// Check format (returns object with pos, neg and zero):
			formats = checkCurrencyFormat(opts.format),

			// Choose which format to use for this value:
			useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;

		// Return with currency symbol added:
		return useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal));
	};


	/**
	 * Format a list of numbers into an accounting column, padding with whitespace
	 * to line up currency symbols, thousand separators and decimals places
	 *
	 * List should be an array of numbers
	 * Second parameter can be an object containing keys that match the params
	 *
	 * Returns array of accouting-formatted number strings of same length
	 *
	 * NB: `white-space:pre` CSS rule is required on the list container to prevent
	 * browsers from collapsing the whitespace in the output strings.
	 */
	lib.formatColumn = function(list, symbol, precision, thousand, decimal, format) {
		if (!list) return [];

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(symbol) ? symbol : {
					symbol : symbol,
					precision : precision,
					thousand : thousand,
					decimal : decimal,
					format : format
				}),
				lib.settings.currency
			),

			// Check format (returns object with pos, neg and zero), only need pos for now:
			formats = checkCurrencyFormat(opts.format),

			// Whether to pad at start of string or after currency symbol:
			padAfterSymbol = formats.pos.indexOf("%s") < formats.pos.indexOf("%v") ? true : false,

			// Store value for the length of the longest string in the column:
			maxLength = 0,

			// Format the list according to options, store the length of the longest string:
			formatted = map(list, function(val, i) {
				if (isArray(val)) {
					// Recursively format columns if list is a multi-dimensional array:
					return lib.formatColumn(val, opts);
				} else {
					// Clean up the value
					val = unformat(val);

					// Choose which format to use for this value (pos, neg or zero):
					var useFormat = val > 0 ? formats.pos : val < 0 ? formats.neg : formats.zero,

						// Format this value, push into formatted list and save the length:
						fVal = useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(val), checkPrecision(opts.precision), opts.thousand, opts.decimal));

					if (fVal.length > maxLength) maxLength = fVal.length;
					return fVal;
				}
			});

		// Pad each number in the list and send back the column of numbers:
		return map(formatted, function(val, i) {
			// Only if this is a string (not a nested array, which would have already been padded):
			if (isString(val) && val.length < maxLength) {
				// Depending on symbol position, pad after symbol or at index 0:
				return padAfterSymbol ? val.replace(opts.symbol, opts.symbol+(new Array(maxLength - val.length + 1).join(" "))) : (new Array(maxLength - val.length + 1).join(" ")) + val;
			}
			return val;
		});
	};


	/* --- Module Definition --- */

	// Export accounting for CommonJS. If being loaded as an AMD module, define it as such.
	// Otherwise, just add `accounting` to the global object
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = lib;
		}
		exports.accounting = lib;
	} else if (typeof define === 'function' && define.amd) {
		// Return the library as an AMD module:
		define([], function() {
			return lib;
		});
	} else {
		// Use accounting.noConflict to restore `accounting` back to its original value.
		// Returns a reference to the library's `accounting` object;
		// e.g. `var numbers = accounting.noConflict();`
		lib.noConflict = (function(oldAccounting) {
			return function() {
				// Reset the value of the root's `accounting` variable:
				root.accounting = oldAccounting;
				// Delete the noConflict method:
				lib.noConflict = undefined;
				// Return reference to the library to re-assign it:
				return lib;
			};
		})(root.accounting);

		// Declare `fx` on the root (global/window) object:
		root['accounting'] = lib;
	}

	// Root will be `window` in browser or `global` on the server:
}(this));


/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function ($, document, undefined) {

    var pluses = /\+/g;

    function raw(s) {
        return s;
    }

    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }

    var config = $.cookie = function (key, value, options) {

        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (value === null) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            if (decode(parts.shift()) === key) {
                var cookie = decode(parts.join('='));
                return config.json ? JSON.parse(cookie) : cookie;
            }
        }

        return null;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== null) {
            $.cookie(key, null, options);
            return true;
        }
        return false;
    };

})(jQuery, document);

