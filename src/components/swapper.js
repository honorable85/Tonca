"use strict";

// Class definition
var $Swapper = function(element, options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        mode: 'append'
    };

    ////////////////////////////
    // ** Private Methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( $Util.data(element).has('swapper') === true ) {
            the = $Util.data(element).get('swapper');
        } else {
            _init();
        }
    }

    var _init = function() {
        the.element = element;
        the.options = $Util.deepExtend({}, defaultOptions, options);

        // Set initialized
        the.element.setAttribute('data-pdms-swapper', 'true');

        // Initial update
        _update();

        // Bind Instance
        $Util.data(the.element).set('swapper', the);
    }

    var _update = function(e) {
        var parentSelector = _getOption('parent');

        var mode = _getOption('mode');
        var parentElement = parentSelector ? document.querySelector(parentSelector) : null;
       

        if (parentElement && element.parentNode !== parentElement) {
            if (mode === 'prepend') {
                parentElement.prepend(element);
            } else if (mode === 'append') {
                parentElement.append(element);
            }
        }
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-pdms-swapper-' + name) === true ) {
            var attr = the.element.getAttribute('data-pdms-swapper-' + name);
            var value = $Util.getResponsiveValue(attr);

            if ( value !== null && String(value) === 'true' ) {
                value = true;
            } else if ( value !== null && String(value) === 'false' ) {
                value = false;
            }

            return value;
        } else {
            var optionName = $Util.snakeToCamel(name);

            if ( the.options[optionName] ) {
                return $Util.getResponsiveValue(the.options[optionName]);
            } else {
                return null;
            }
        }
    }

    var _destroy = function() {
        $Util.data(the.element).remove('swapper');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Methods
    the.update = function() {
        _update();
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return $EventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return $EventHandler.one(the.element, name, handler);
    }

    the.off = function(name) {
        return $EventHandler.off(the.element, name);
    }

    the.trigger = function(name, event) {
        return $EventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
$Swapper.getInstance = function(element) {
    if ( element !== null && $Util.data(element).has('swapper') ) {
        return $Util.data(element).get('swapper');
    } else {
        return null;
    }
}

// Create instances
$Swapper.createInstances = function(selector = '[data-pdms-swapper="true"]') {
    // Initialize Menus
    var elements = document.querySelectorAll(selector);
    var swapper;

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            swapper = new $Swapper(elements[i]);
        }
    }
}

// Window resize handler
window.addEventListener('resize', function() {
    var timer;

    $Util.throttle(timer, function() {
        // Locate and update Offcanvas instances on window resize
        var elements = document.querySelectorAll('[data-pdms-swapper="true"]');

        if ( elements && elements.length > 0 ) {
            for (var i = 0, len = elements.length; i < len; i++) {
                var swapper = $Swapper.getInstance(elements[i]);
                if (swapper) {
                    swapper.update();
                }                
            }
        }
    }, 200);
});

// Global initialization
$Swapper.init = function() {
    $Swapper.createInstances();
};

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', $Swapper.init);
} else {
    $Swapper.init();
}

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = $Swapper;
}
