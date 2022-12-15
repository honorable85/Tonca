"use strict";

import $Util from "./util";
import $EventHandler from "./event-handler";

// Class definition
var $Scrolltop = function(element, options) {
    ////////////////////////////
    // ** Private variables  ** //
    ////////////////////////////
    var the = this;
    var body = document.getElementsByTagName("BODY")[0];

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default options
    var defaultOptions = {
        offset: 300,
        speed: 600
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ($Util.data(element).has('scrolltop')) {
            the = $Util.data(element).get('scrolltop');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = $Util.deepExtend({}, defaultOptions, options);
        the.uid = $Util.getUniqueId('scrolltop');
        the.element = element;

        // Set initialized
        the.element.setAttribute('data-pdms-scrolltop', 'true');

        // Event Handlers
        _handlers();

        // Bind Instance
        $Util.data(the.element).set('scrolltop', the);
    }

    var _handlers = function() {
        var timer;

        window.addEventListener('scroll', function() {
            $Util.throttle(timer, function() {
                _scroll();
            }, 200);
        });

        $Util.addEvent(the.element, 'click', function(e) {
            e.preventDefault();

            _go();
        });
    }

    var _scroll = function() {
        var offset = parseInt(_getOption('offset'));
        
        var pos = $Util.getScrollTop(); // current vertical position

        if ( pos > offset ) {
            if ( body.hasAttribute('data-pdms-scrolltop') === false ) {
                body.setAttribute('data-pdms-scrolltop', 'on');
            }
        } else {
            if ( body.hasAttribute('data-pdms-scrolltop') === true ) {
                body.removeAttribute('data-pdms-scrolltop');
            }
        }
    }

    var _go = function() {
        var speed = parseInt(_getOption('speed'));

        $Util.scrollTop(0, speed);
    }

    var _getOption = function(name) {
        if ( the.element.hasAttribute('data-pdms-scrolltop-' + name) === true ) {
            var attr = the.element.getAttribute('data-pdms-scrolltop-' + name);
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
        $Util.data(the.element).remove('scrolltop');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.go = function() {
        return _go();
    }

    the.getElement = function() {
        return the.element;
    }

    the.destroy = function() {
        return _destroy();
    }
};

// Static methods
$Scrolltop.getInstance = function(element) {
    if (element && $Util.data(element).has('scrolltop')) {
        return $Util.data(element).get('scrolltop');
    } else {
        return null;
    }
}

// Create instances
$Scrolltop.createInstances = function(selector = '[data-pdms-scrolltop="true"]') {
    var body = document.getElementsByTagName("BODY")[0];

    // Initialize Menus
    var elements = body.querySelectorAll(selector);
    var scrolltop;

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            scrolltop = new $Scrolltop(elements[i]);
        }
    }
}

// Global initialization
$Scrolltop.init = function() {
    $Scrolltop.createInstances();
};

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', $Scrolltop.init);
} else {
    $Scrolltop.init();
}

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = $Scrolltop;
}
