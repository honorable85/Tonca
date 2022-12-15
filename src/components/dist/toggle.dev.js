"use strict"; // Class definition

var CAToggle = function CAToggle(element, options) {
  ////////////////////////////
  // ** Private variables  ** //
  ////////////////////////////
  var the = this;
  var body = document.getElementsByTagName("BODY")[0];

  if (!element) {
    return;
  } // Default Options


  var defaultOptions = {
    saveState: true
  }; ////////////////////////////
  // ** Private methods  ** //
  ////////////////////////////

  var _construct = function _construct() {
    if (CAUtil.data(element).has('toggle') === true) {
      the = CAUtil.data(element).get('toggle');
    } else {
      _init();
    }
  };

  var _init = function _init() {
    // Variables
    the.options = CAUtil.deepExtend({}, defaultOptions, options);
    the.uid = CAUtil.getUniqueId('toggle'); // Elements

    the.element = element;
    the.target = document.querySelector(the.element.getAttribute('data-pdms-toggle-target')) ? document.querySelector(the.element.getAttribute('data-pdms-toggle-target')) : the.element;
    the.state = the.element.hasAttribute('data-pdms-toggle-state') ? the.element.getAttribute('data-pdms-toggle-state') : '';
    the.attribute = 'data-pdms-' + the.element.getAttribute('data-pdms-toggle-name'); // Event Handlers

    _handlers(); // Bind Instance


    CAUtil.data(the.element).set('toggle', the);
  };

  var _handlers = function _handlers() {
    CAUtil.addEvent(the.element, 'click', function (e) {
      e.preventDefault();

      _toggle();
    });
  }; // Event handlers


  var _toggle = function _toggle() {
    // Trigger "after.toggle" event
    CAEventHandler.trigger(the.element, 'ca.toggle.change', the);

    if (_isEnabled()) {
      _disable();
    } else {
      _enable();
    } // Trigger "before.toggle" event


    CAEventHandler.trigger(the.element, 'ca.toggle.changed', the);
    return the;
  };

  var _enable = function _enable() {
    if (_isEnabled() === true) {
      return;
    }

    CAEventHandler.trigger(the.element, 'ca.toggle.enable', the);
    the.target.setAttribute(the.attribute, 'on');

    if (the.state.length > 0) {
      the.element.classList.add(the.state);
    }

    if (typeof CACookie !== 'undefined' && the.options.saveState === true) {
      CACookie.set(the.attribute, 'on');
    }

    CAEventHandler.trigger(the.element, 'ca.toggle.enabled', the);
    return the;
  };

  var _disable = function _disable() {
    if (_isEnabled() === false) {
      return;
    }

    CAEventHandler.trigger(the.element, 'ca.toggle.disable', the);
    the.target.removeAttribute(the.attribute);

    if (the.state.length > 0) {
      the.element.classList.remove(the.state);
    }

    if (typeof CACookie !== 'undefined' && the.options.saveState === true) {
      CACookie.remove(the.attribute);
    }

    CAEventHandler.trigger(the.element, 'ca.toggle.disabled', the);
    return the;
  };

  var _isEnabled = function _isEnabled() {
    return String(the.target.getAttribute(the.attribute)).toLowerCase() === 'on';
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('toggle');
  }; // Construct class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Plugin API


  the.toggle = function () {
    return _toggle();
  };

  the.enable = function () {
    return _enable();
  };

  the.disable = function () {
    return _disable();
  };

  the.isEnabled = function () {
    return _isEnabled();
  };

  the.goElement = function () {
    return the.element;
  };

  the.destroy = function () {
    return _destroy();
  }; // Event API


  the.on = function (name, handler) {
    return CAEventHandler.on(the.element, name, handler);
  };

  the.one = function (name, handler) {
    return CAEventHandler.one(the.element, name, handler);
  };

  the.off = function (name) {
    return CAEventHandler.off(the.element, name);
  };

  the.trigger = function (name, event) {
    return CAEventHandler.trigger(the.element, name, event, the, event);
  };
}; // Static methods


CAToggle.getInstance = function (element) {
  if (element !== null && CAUtil.data(element).has('toggle')) {
    return CAUtil.data(element).get('toggle');
  } else {
    return null;
  }
}; // Create instances


CAToggle.createInstances = function () {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-pdms-toggle]';
  var body = document.getElementsByTagName("BODY")[0]; // Get instances

  var elements = body.querySelectorAll(selector);

  if (elements && elements.length > 0) {
    for (var i = 0, len = elements.length; i < len; i++) {
      // Initialize instances
      new CAToggle(elements[i]);
    }
  }
}; // Global initialization


CAToggle.init = function () {
  CAToggle.createInstances();
}; // On document ready


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CAToggle.init);
} else {
  CAToggle.init();
} // Webpack support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CAToggle;
}