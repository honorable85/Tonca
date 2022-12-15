"use strict"; // Class definition

var CASwapper = function CASwapper(element, options) {
  ////////////////////////////
  // ** Private Variables  ** //
  ////////////////////////////
  var the = this;

  if (typeof element === "undefined" || element === null) {
    return;
  } // Default Options


  var defaultOptions = {
    mode: 'append'
  }; ////////////////////////////
  // ** Private Methods  ** //
  ////////////////////////////

  var _construct = function _construct() {
    if (CAUtil.data(element).has('swapper') === true) {
      the = CAUtil.data(element).get('swapper');
    } else {
      _init();
    }
  };

  var _init = function _init() {
    the.element = element;
    the.options = CAUtil.deepExtend({}, defaultOptions, options); // Set initialized

    the.element.setAttribute('data-pdms-swapper', 'true'); // Initial update

    _update(); // Bind Instance


    CAUtil.data(the.element).set('swapper', the);
  };

  var _update = function _update(e) {
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
  };

  var _getOption = function _getOption(name) {
    if (the.element.hasAttribute('data-pdms-swapper-' + name) === true) {
      var attr = the.element.getAttribute('data-pdms-swapper-' + name);
      var value = CAUtil.getResponsiveValue(attr);

      if (value !== null && String(value) === 'true') {
        value = true;
      } else if (value !== null && String(value) === 'false') {
        value = false;
      }

      return value;
    } else {
      var optionName = CAUtil.snakeToCamel(name);

      if (the.options[optionName]) {
        return CAUtil.getResponsiveValue(the.options[optionName]);
      } else {
        return null;
      }
    }
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('swapper');
  }; // Construct Class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Methods


  the.update = function () {
    _update();
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


CASwapper.getInstance = function (element) {
  if (element !== null && CAUtil.data(element).has('swapper')) {
    return CAUtil.data(element).get('swapper');
  } else {
    return null;
  }
}; // Create instances


CASwapper.createInstances = function () {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-pdms-swapper="true"]';
  // Initialize Menus
  var elements = document.querySelectorAll(selector);
  var swapper;

  if (elements && elements.length > 0) {
    for (var i = 0, len = elements.length; i < len; i++) {
      swapper = new CASwapper(elements[i]);
    }
  }
}; // Window resize handler


window.addEventListener('resize', function () {
  var timer;
  CAUtil.throttle(timer, function () {
    // Locate and update Offcanvas instances on window resize
    var elements = document.querySelectorAll('[data-pdms-swapper="true"]');

    if (elements && elements.length > 0) {
      for (var i = 0, len = elements.length; i < len; i++) {
        var swapper = CASwapper.getInstance(elements[i]);

        if (swapper) {
          swapper.update();
        }
      }
    }
  }, 200);
}); // Global initialization

CASwapper.init = function () {
  CASwapper.createInstances();
}; // On document ready


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CASwapper.init);
} else {
  CASwapper.init();
} // Webpack support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CASwapper;
}