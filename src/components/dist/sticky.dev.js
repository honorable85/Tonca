"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _util = _interopRequireDefault(require("./util"));

var _eventHandler = _interopRequireDefault(require("./event-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Class definition
var CASticky = function CASticky(element, options) {
  ////////////////////////////
  // ** Private Variables  ** //
  ////////////////////////////
  var the = this;
  var body = document.getElementsByTagName("BODY")[0];

  if (typeof element === "undefined" || element === null) {
    return;
  } // Default Options


  var defaultOptions = {
    offset: 200,
    releaseOffset: 0,
    reverse: false,
    animation: true,
    animationSpeed: '0.3s',
    animationClass: 'animation-slide-in-down'
  }; ////////////////////////////
  // ** Private Methods  ** //
  ////////////////////////////

  var _construct = function _construct() {
    if (_util["default"].data(element).has('sticky') === true) {
      the = _util["default"].data(element).get('sticky');
    } else {
      _init();
    }
  };

  var _init = function _init() {
    the.element = element;
    the.options = _util["default"].deepExtend({}, defaultOptions, options);
    the.uid = _util["default"].getUniqueId('sticky');
    the.name = the.element.getAttribute('data-pdms-sticky-name');
    the.attributeName = 'data-pdms-sticky-' + the.name;
    the.eventTriggerState = true;
    the.lastScrollTop = 0;
    the.scrollHandler; // Set initialized

    the.element.setAttribute('data-pdms-sticky', 'true'); // Event Handlers

    window.addEventListener('scroll', _scroll); // Initial Launch

    _scroll(); // Bind Instance


    _util["default"].data(the.element).set('sticky', the);
  };

  var _scroll = function _scroll(e) {
    var offset = _getOption('offset');

    var releaseOffset = _getOption('release-offset');

    var reverse = _getOption('reverse');

    var st;
    var attrName;
    var diff; // Exit if false

    if (offset === false) {
      return;
    }

    offset = parseInt(offset);
    releaseOffset = releaseOffset ? parseInt(releaseOffset) : 0;
    st = _util["default"].getScrollTop();
    diff = document.documentElement.scrollHeight - window.innerHeight - _util["default"].getScrollTop();

    if (reverse === true) {
      // Release on reverse scroll mode
      if (st > offset && (releaseOffset === 0 || releaseOffset < diff)) {
        if (body.hasAttribute(the.attributeName) === false) {
          _enable();

          body.setAttribute(the.attributeName, 'on');
        }

        if (the.eventTriggerState === true) {
          _eventHandler["default"].trigger(the.element, 'ca.sticky.on', the);

          _eventHandler["default"].trigger(the.element, 'ca.sticky.change', the);

          the.eventTriggerState = false;
        }
      } else {
        // Back scroll mode
        if (body.hasAttribute(the.attributeName) === true) {
          _disable();

          body.removeAttribute(the.attributeName);
        }

        if (the.eventTriggerState === false) {
          _eventHandler["default"].trigger(the.element, 'ca.sticky.off', the);

          _eventHandler["default"].trigger(the.element, 'ca.sticky.change', the);

          the.eventTriggerState = true;
        }
      }

      the.lastScrollTop = st;
    } else {
      // Classic scroll mode
      if (st > offset && (releaseOffset === 0 || releaseOffset < diff)) {
        if (body.hasAttribute(the.attributeName) === false) {
          _enable();

          body.setAttribute(the.attributeName, 'on');
        }

        if (the.eventTriggerState === true) {
          _eventHandler["default"].trigger(the.element, 'ca.sticky.on', the);

          _eventHandler["default"].trigger(the.element, 'ca.sticky.change', the);

          the.eventTriggerState = false;
        }
      } else {
        // back scroll mode
        if (body.hasAttribute(the.attributeName) === true) {
          _disable();

          body.removeAttribute(the.attributeName);
        }

        if (the.eventTriggerState === false) {
          _eventHandler["default"].trigger(the.element, 'ca.sticky.off', the);

          _eventHandler["default"].trigger(the.element, 'ca.sticky.change', the);

          the.eventTriggerState = true;
        }
      }
    }

    if (releaseOffset > 0) {
      if (diff < releaseOffset) {
        the.element.setAttribute('data-pdms-sticky-released', 'true');
      } else {
        the.element.removeAttribute('data-pdms-sticky-released');
      }
    }
  };

  var _enable = function _enable(update) {
    var top = _getOption('top');

    var left = _getOption('left');

    var right = _getOption('right');

    var width = _getOption('width');

    var zindex = _getOption('zindex');

    if (update !== true && _getOption('animation') === true) {
      _util["default"].css(the.element, 'animationDuration', _getOption('animationSpeed'));

      _util["default"].animateClass(the.element, 'animation ' + _getOption('animationClass'));
    }

    if (zindex !== null) {
      _util["default"].css(the.element, 'z-index', zindex);

      _util["default"].css(the.element, 'position', 'fixed');
    }

    if (top !== null) {
      _util["default"].css(the.element, 'top', top);
    }

    if (width !== null) {
      if (width['target']) {
        var targetElement = document.querySelector(width['target']);

        if (targetElement) {
          width = _util["default"].css(targetElement, 'width');
        }
      }

      _util["default"].css(the.element, 'width', width);
    }

    if (left !== null) {
      if (String(left).toLowerCase() === 'auto') {
        var offsetLeft = _util["default"].offset(the.element).left;

        if (offsetLeft > 0) {
          _util["default"].css(the.element, 'left', String(offsetLeft) + 'px');
        }
      }
    }
  };

  var _disable = function _disable() {
    _util["default"].css(the.element, 'top', '');

    _util["default"].css(the.element, 'width', '');

    _util["default"].css(the.element, 'left', '');

    _util["default"].css(the.element, 'right', '');

    _util["default"].css(the.element, 'z-index', '');

    _util["default"].css(the.element, 'position', '');
  };

  var _getOption = function _getOption(name) {
    if (the.element.hasAttribute('data-pdms-sticky-' + name) === true) {
      var attr = the.element.getAttribute('data-pdms-sticky-' + name);

      var value = _util["default"].getResponsiveValue(attr);

      if (value !== null && String(value) === 'true') {
        value = true;
      } else if (value !== null && String(value) === 'false') {
        value = false;
      }

      return value;
    } else {
      var optionName = _util["default"].snakeToCamel(name);

      if (the.options[optionName]) {
        return _util["default"].getResponsiveValue(the.options[optionName]);
      } else {
        return null;
      }
    }
  };

  var _destroy = function _destroy() {
    window.removeEventListener('scroll', _scroll);

    _util["default"].data(the.element).remove('sticky');
  }; // Construct Class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Methods


  the.update = function () {
    if (body.hasAttribute(the.attributeName) === true) {
      _disable();

      body.removeAttribute(the.attributeName);

      _enable(true);

      body.setAttribute(the.attributeName, 'on');
    }
  };

  the.destroy = function () {
    return _destroy();
  }; // Event API


  the.on = function (name, handler) {
    return _eventHandler["default"].on(the.element, name, handler);
  };

  the.one = function (name, handler) {
    return _eventHandler["default"].one(the.element, name, handler);
  };

  the.off = function (name) {
    return _eventHandler["default"].off(the.element, name);
  };

  the.trigger = function (name, event) {
    return _eventHandler["default"].trigger(the.element, name, event, the, event);
  };
}; // Static methods


CASticky.getInstance = function (element) {
  if (element !== null && _util["default"].data(element).has('sticky')) {
    return _util["default"].data(element).get('sticky');
  } else {
    return null;
  }
}; // Create instances


CASticky.createInstances = function () {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-pdms-sticky="true"]';
  var body = document.getElementsByTagName("BODY")[0]; // Initialize Menus

  var elements = body.querySelectorAll(selector);
  var sticky;

  if (elements && elements.length > 0) {
    for (var i = 0, len = elements.length; i < len; i++) {
      sticky = new CASticky(elements[i]);
    }
  }
}; // Window resize handler


window.addEventListener('resize', function () {
  var timer;
  var body = document.getElementsByTagName("BODY")[0];

  _util["default"].throttle(timer, function () {
    // Locate and update Offcanvas instances on window resize
    var elements = body.querySelectorAll('[data-pdms-sticky="true"]');

    if (elements && elements.length > 0) {
      for (var i = 0, len = elements.length; i < len; i++) {
        var sticky = CASticky.getInstance(elements[i]);

        if (sticky) {
          sticky.update();
        }
      }
    }
  }, 200);
}); // Global initialization

CASticky.init = function () {
  CASticky.createInstances();
};

var _default = CASticky;
exports["default"] = _default;