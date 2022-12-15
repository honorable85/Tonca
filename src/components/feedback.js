"use strict";

// Class definition
var $Feedback = function(options) {
    ////////////////////////////
    // ** Private Variables  ** //
    ////////////////////////////
    var the = this;
    var body = document.getElementsByTagName("BODY")[0];

    // Default options
    var defaultOptions = {
        'width' : 100,
        'placement' : 'top-center',
        'content' : '',
        'type': 'popup'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        _init();
    }

    var _init = function() {
        // Variables
        the.options = $Util.deepExtend({}, defaultOptions, options);
        the.uid = $Util.getUniqueId('feedback');
        the.element;
        the.shown = false;

        // Event Handlers
        _handlers();

        // Bind Instance
        $Util.data(the.element).set('feedback', the);
    }

    var _handlers = function() {
        $Util.addEvent(the.element, 'click', function(e) {
            e.preventDefault();

            _go();
        });
    }

    var _show = function() {
        if ( $EventHandler.trigger(the.element, 'pdms.feedback.show', the) === false ) {
            return;
        }

        if ( the.options.type === 'popup') {
            _showPopup();
        }

        $EventHandler.trigger(the.element, 'pdms.feedback.shown', the);

        return the;
    }

    var _hide = function() {
        if ( $EventHandler.trigger(the.element, 'pdms.feedback.hide', the) === false ) {
            return;
        }

        if ( the.options.type === 'popup') {
            _hidePopup();
        }

        the.shown = false;

        $EventHandler.trigger(the.element, 'pdms.feedback.hidden', the);

        return the;
    }

    var _showPopup = function() {
        the.element = document.createElement("DIV");

        $Util.addClass(the.element, 'feedback feedback-popup');
        $Util.setHTML(the.element, the.options.content);

        if (the.options.placement == 'top-center') {
            _setPopupTopCenterPosition();
        }

        body.appendChild(the.element);

        $Util.addClass(the.element, 'feedback-shown');

        the.shown = true;
    }

    var _setPopupTopCenterPosition = function() {
        var width = $Util.getResponsiveValue(the.options.width);
        var height = $Util.css(the.element, 'height');

        $Util.addClass(the.element, 'feedback-top-center');

        $Util.css(the.element, 'width', width);
        $Util.css(the.element, 'left', '50%');
        $Util.css(the.element, 'top', '-' + height);
    }

    var _hidePopup = function() {
        the.element.remove();
    }

    var _destroy = function() {
        $Util.data(the.element).remove('feedback');
    }

    // Construct class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.show = function() {
        return _show();
    }

    the.hide = function() {
        return _hide();
    }

    the.isShown = function() {
        return the.shown;
    }

    the.getElement = function() {
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

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = $Feedback;
}
