"use strict";

// Class definition
var $Toggle = function(element, options) {
    ////////////////////////////
    // ** Private variables  ** //
    ////////////////////////////
    var the = this;
    var body = document.getElementsByTagName("BODY")[0];

    if (!element) {
        return;
    }

    // Default Options
    var defaultOptions = {
        saveState: true
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( $Util.data(element).has('toggle') === true ) {
            the = $Util.data(element).get('toggle');
        } else {
            _init();
        }
    }

    var _init = function() {
        // Variables
        the.options = $Util.deepExtend({}, defaultOptions, options);
        the.uid = $Util.getUniqueId('toggle');

        // Elements
        the.element = element;

        the.target = document.querySelector(the.element.getAttribute('data-pdms-toggle-target')) ? document.querySelector(the.element.getAttribute('data-pdms-toggle-target')) : the.element;
        the.state = the.element.hasAttribute('data-pdms-toggle-state') ? the.element.getAttribute('data-pdms-toggle-state') : '';
        the.attribute = 'data-pdms-' + the.element.getAttribute('data-pdms-toggle-name');

        // Event Handlers
        _handlers();

        // Bind Instance
        $Util.data(the.element).set('toggle', the);
    }

    var _handlers = function() {
        $Util.addEvent(the.element, 'click', function(e) {
            e.preventDefault();

            _toggle();
        });
    }

    // Event handlers
    var _toggle = function() {
        // Trigger "after.toggle" event
        $EventHandler.trigger(the.element, 'pdms.toggle.change', the);

        if ( _isEnabled() ) {
            _disable();
        } else {
            _enable();
        }

        // Trigger "before.toggle" event
        $EventHandler.trigger(the.element, 'pdms.toggle.changed', the);

        return the;
    }

    var _enable = function() {
        if ( _isEnabled() === true ) {
            return;
        }

        $EventHandler.trigger(the.element, 'pdms.toggle.enable', the);

        the.target.setAttribute(the.attribute, 'on');

        if (the.state.length > 0) {
            the.element.classList.add(the.state);
        }        

        if ( typeof $Cookie !== 'undefined' && the.options.saveState === true ) {
            $Cookie.set(the.attribute, 'on');
        }

        $EventHandler.trigger(the.element, 'pdms.toggle.enabled', the);

        return the;
    }

    var _disable = function() {
        if ( _isEnabled() === false ) {
            return;
        }

        $EventHandler.trigger(the.element, 'pdms.toggle.disable', the);

        the.target.removeAttribute(the.attribute);

        if (the.state.length > 0) {
            the.element.classList.remove(the.state);
        } 

        if ( typeof $Cookie !== 'undefined' && the.options.saveState === true ) {
            $Cookie.remove(the.attribute);
        }

        $EventHandler.trigger(the.element, 'pdms.toggle.disabled', the);

        return the;
    }

    var _isEnabled = function() {
        return (String(the.target.getAttribute(the.attribute)).toLowerCase() === 'on');
    }

    var _destroy = function() {
        $Util.data(the.element).remove('toggle');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.toggle = function() {
        return _toggle();
    }

    the.enable = function() {
        return _enable();
    }

    the.disable = function() {
        return _disable();
    }

    the.isEnabled = function() {
        return _isEnabled();
    }

    the.goElement = function() {
        return the.element;
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
$Toggle.getInstance = function(element) {
    if ( element !== null && $Util.data(element).has('toggle') ) {
        return $Util.data(element).get('toggle');
    } else {
        return null;
    }
}

// Create instances
$Toggle.createInstances = function(selector = '[data-pdms-toggle]') {
    var body = document.getElementsByTagName("BODY")[0];

    // Get instances
    var elements = body.querySelectorAll(selector);

    if ( elements && elements.length > 0 ) {
        for (var i = 0, len = elements.length; i < len; i++) {
            // Initialize instances
            new $Toggle(elements[i]);
        }
    }
}

// Global initialization
$Toggle.init = function() {
    $Toggle.createInstances();
};

// On document ready
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', $Toggle.init);
} else {
    $Toggle.init();
}

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = $Toggle;
}