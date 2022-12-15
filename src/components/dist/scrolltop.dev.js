"use strict"; // Class definition

var CAScrolltop = function CAScrolltop(element, options) {
  ////////////////////////////
  // ** Private variables  ** //
  ////////////////////////////
  var the = this;
  var body = document.getElementsByTagName("BODY")[0];

  if (typeof element === "undefined" || element === null) {
    return;
  } // Default options


  var defaultOptions = {
    offset: 300,
    speed: 600
  }; ////////////////////////////
  // ** Private methods  ** //
  ////////////////////////////

  var _construct = function _construct() {
    if (CAUtil.data(element).has('scrolltop')) {
      the = CAUtil.data(element).get('scrolltop');
    } else {
      _init();
    }
  };

  var _init = function _init() {
    // Variables
    the.options = CAUtil.deepExtend({}, defaultOptions, options);
    the.uid = CAUtil.getUniqueId('scrolltop');
    the.element = element; // Set initialized

    the.element.setAttribute('data-pdms-scrolltop', 'true'); // Event Handlers

    _handlers(); // Bind Instance


    CAUtil.data(the.element).set('scrolltop', the);
  };

  var _handlers = function _handlers() {
    var timer;
    window.addEventListener('scroll', function () {
      CAUtil.throttle(timer, function () {
        _scroll();
      }, 200);
    });
    CAUtil.addEvent(the.element, 'click', function (e) {
      e.preventDefault();

      _go();
    });
  };

  var _scroll = function _scroll() {
    var offset = parseInt(_getOption('offset'));
    var pos = CAUtil.getScrollTop(); // current vertical position

    if (pos > offset) {
      if (body.hasAttribute('data-pdms-scrolltop') === false) {
        body.setAttribute('data-pdms-scrolltop', 'on');
      }
    } else {
      if (body.hasAttribute('data-pdms-scrolltop') === true) {
        body.removeAttribute('data-pdms-scrolltop');
      }
    }
  };

  var _go = function _go() {
    var speed = parseInt(_getOption('speed'));
    CAUtil.scrollTop(0, speed);
  };

  var _getOption = function _getOption(name) {
    if (the.element.hasAttribute('data-pdms-scrolltop-' + name) === true) {
      var attr = the.element.getAttribute('data-pdms-scrolltop-' + name);
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
    CAUtil.data(the.element).remove('scrolltop');
  }; // Construct class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Plugin API


  the.go = function () {
    return _go();
  };

  the.getElement = function () {
    return the.element;
  };

  the.destroy = function () {
    return _destroy();
  };
}; // Static methods


CAScrolltop.getInstance = function (element) {
  if (element && CAUtil.data(element).has('scrolltop')) {
    return CAUtil.data(element).get('scrolltop');
  } else {
    return null;
  }
}; // Create instances


CAScrolltop.createInstances = function () {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-pdms-scrolltop="true"]';
  var body = document.getElementsByTagName("BODY")[0]; // Initialize Menus

  var elements = body.querySelectorAll(selector);
  var scrolltop;

  if (elements && elements.length > 0) {
    for (var i = 0, len = elements.length; i < len; i++) {
      scrolltop = new CAScrolltop(elements[i]);
    }
  }
}; // Global initialization


CAScrolltop.init = function () {
  CAScrolltop.createInstances();
}; // On document ready


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CAScrolltop.init);
} else {
  CAScrolltop.init();
} // Webpack support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CAScrolltop;
}