"use strict"; // Class definition

var CAScroll = function CAScroll(element, options) {
  ////////////////////////////
  // ** Private Variables  ** //
  ////////////////////////////
  var the = this;
  var body = document.getElementsByTagName("BODY")[0];

  if (!element) {
    return;
  } // Default options


  var defaultOptions = {
    saveState: true
  }; ////////////////////////////
  // ** Private Methods  ** //
  ////////////////////////////

  var _construct = function _construct() {
    if (CAUtil.data(element).has('scroll')) {
      the = CAUtil.data(element).get('scroll');
    } else {
      _init();
    }
  };

  var _init = function _init() {
    // Variables
    the.options = CAUtil.deepExtend({}, defaultOptions, options); // Elements

    the.element = element;
    the.id = the.element.getAttribute('id'); // Set initialized

    the.element.setAttribute('data-pdms-scroll', 'true'); // Update

    _update(); // Bind Instance


    CAUtil.data(the.element).set('scroll', the);
  };

  var _setupHeight = function _setupHeight() {
    var heightType = _getHeightType();

    var height = _getHeight(); // Set height


    if (height !== null && height.length > 0) {
      CAUtil.css(the.element, heightType, height);
    } else {
      CAUtil.css(the.element, heightType, '');
    }
  };

  var _setupState = function _setupState() {
    if (_getOption('save-state') === true && typeof CACookie !== 'undefined' && the.id) {
      if (CACookie.get(the.id + 'st')) {
        var pos = parseInt(CACookie.get(the.id + 'st'));

        if (pos > 0) {
          the.element.scrollTop = pos;
        }
      }
    }
  };

  var _setupScrollHandler = function _setupScrollHandler() {
    if (_getOption('save-state') === true && typeof CACookie !== 'undefined' && the.id) {
      the.element.addEventListener('scroll', _scrollHandler);
    } else {
      the.element.removeEventListener('scroll', _scrollHandler);
    }
  };

  var _destroyScrollHandler = function _destroyScrollHandler() {
    the.element.removeEventListener('scroll', _scrollHandler);
  };

  var _resetHeight = function _resetHeight() {
    CAUtil.css(the.element, _getHeightType(), '');
  };

  var _scrollHandler = function _scrollHandler() {
    CACookie.set(the.id + 'st', the.element.scrollTop);
  };

  var _update = function _update() {
    // Activate/deactivate
    if (_getOption('activate') === true || the.element.hasAttribute('data-pdms-scroll-activate') === false) {
      _setupHeight();

      _setupScrollHandler();

      _setupState();
    } else {
      _resetHeight();

      _destroyScrollHandler();
    }
  };

  var _getHeight = function _getHeight() {
    var height = _getOption(_getHeightType());

    if (height instanceof Function) {
      return height.call();
    } else if (height !== null && typeof height === 'string' && height.toLowerCase() === 'auto') {
      return _getAutoHeight();
    } else {
      return height;
    }
  };

  var _getAutoHeight = function _getAutoHeight() {
    var height = CAUtil.getViewPort().height;

    var dependencies = _getOption('dependencies');

    var wrappers = _getOption('wrappers');

    var offset = _getOption('offset'); // Height dependencies


    if (dependencies !== null) {
      var elements = document.querySelectorAll(dependencies);

      if (elements && elements.length > 0) {
        for (var i = 0, len = elements.length; i < len; i++) {
          var element = elements[i];

          if (CAUtil.visible(element) === false) {
            continue;
          }

          height = height - parseInt(CAUtil.css(element, 'height'));
          height = height - parseInt(CAUtil.css(element, 'margin-top'));
          height = height - parseInt(CAUtil.css(element, 'margin-bottom'));

          if (CAUtil.css(element, 'border-top')) {
            height = height - parseInt(CAUtil.css(element, 'border-top'));
          }

          if (CAUtil.css(element, 'border-bottom')) {
            height = height - parseInt(CAUtil.css(element, 'border-bottom'));
          }
        }
      }
    } // Wrappers


    if (wrappers !== null) {
      var elements = document.querySelectorAll(wrappers);

      if (elements && elements.length > 0) {
        for (var i = 0, len = elements.length; i < len; i++) {
          var element = elements[i];

          if (CAUtil.visible(element) === false) {
            continue;
          }

          height = height - parseInt(CAUtil.css(element, 'margin-top'));
          height = height - parseInt(CAUtil.css(element, 'margin-bottom'));
          height = height - parseInt(CAUtil.css(element, 'padding-top'));
          height = height - parseInt(CAUtil.css(element, 'padding-bottom'));

          if (CAUtil.css(element, 'border-top')) {
            height = height - parseInt(CAUtil.css(element, 'border-top'));
          }

          if (CAUtil.css(element, 'border-bottom')) {
            height = height - parseInt(CAUtil.css(element, 'border-bottom'));
          }
        }
      }
    } // Custom offset


    if (offset !== null) {
      height = height - parseInt(offset);
    }

    height = height - parseInt(CAUtil.css(the.element, 'margin-top'));
    height = height - parseInt(CAUtil.css(the.element, 'margin-bottom'));

    if (CAUtil.css(element, 'border-top')) {
      height = height - parseInt(CAUtil.css(element, 'border-top'));
    }

    if (CAUtil.css(element, 'border-bottom')) {
      height = height - parseInt(CAUtil.css(element, 'border-bottom'));
    }

    height = String(height) + 'px';
    return height;
  };

  var _getOption = function _getOption(name) {
    if (the.element.hasAttribute('data-pdms-scroll-' + name) === true) {
      var attr = the.element.getAttribute('data-pdms-scroll-' + name);
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

  var _getHeightType = function _getHeightType() {
    if (_getOption('height')) {
      return 'height';
    }

    if (_getOption('min-height')) {
      return 'min-height';
    }

    if (_getOption('max-height')) {
      return 'max-height';
    }
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('scroll');
  }; // Construct Class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////


  the.update = function () {
    return _update();
  };

  the.getHeight = function () {
    return _getHeight();
  };

  the.getElement = function () {
    return the.element;
  };

  the.destroy = function () {
    return _destroy();
  };
}; // Static methods


CAScroll.getInstance = function (element) {
  if (element !== null && CAUtil.data(element).has('scroll')) {
    return CAUtil.data(element).get('scroll');
  } else {
    return null;
  }
}; // Create instances


CAScroll.createInstances = function () {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-pdms-scroll="true"]';
  var body = document.getElementsByTagName("BODY")[0]; // Initialize Menus

  var elements = body.querySelectorAll(selector);

  if (elements && elements.length > 0) {
    for (var i = 0, len = elements.length; i < len; i++) {
      new CAScroll(elements[i]);
    }
  }
}; // Window resize handling


window.addEventListener('resize', function () {
  var timer;
  var body = document.getElementsByTagName("BODY")[0];
  CAUtil.throttle(timer, function () {
    // Locate and update Offcanvas instances on window resize
    var elements = body.querySelectorAll('[data-pdms-scroll="true"]');

    if (elements && elements.length > 0) {
      for (var i = 0, len = elements.length; i < len; i++) {
        var scroll = CAScroll.getInstance(elements[i]);

        if (scroll) {
          scroll.update();
        }
      }
    }
  }, 200);
}); // Global initialization

CAScroll.init = function () {
  CAScroll.createInstances();
}; // On document ready


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CAScroll.init);
} else {
  CAScroll.init();
} // Webpack Support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CAScroll;
}