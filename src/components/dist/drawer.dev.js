"use strict"; // Class definition

var CADrawer = function CADrawer(element, options) {
  //////////////////////////////
  // ** Private variables  ** //
  //////////////////////////////
  var the = this;
  var body = document.getElementsByTagName("BODY")[0];

  if (typeof element === "undefined" || element === null) {
    return;
  } // Default options


  var defaultOptions = {
    overlay: true,
    direction: 'end',
    baseClass: 'drawer',
    overlayClass: 'drawer-overlay'
  }; ////////////////////////////
  // ** Private methods  ** //
  ////////////////////////////

  var _construct = function _construct() {
    if (CAUtil.data(element).has('drawer')) {
      the = CAUtil.data(element).get('drawer');
    } else {
      _init();
    }
  };

  var _init = function _init() {
    // Variables
    the.options = CAUtil.deepExtend({}, defaultOptions, options);
    the.uid = CAUtil.getUniqueId('drawer');
    the.element = element;
    the.overlayElement = null;
    the.name = the.element.getAttribute('data-pdms-drawer-name');
    the.shown = false;
    the.lastWidth;
    the.toggleElement = null; // Set initialized

    the.element.setAttribute('data-pdms-drawer', 'true'); // Event Handlers

    _handlers(); // Update Instance


    _update(); // Bind Instance


    CAUtil.data(the.element).set('drawer', the);
  };

  var _handlers = function _handlers() {
    var togglers = _getOption('toggle');

    var closers = _getOption('close');

    if (togglers !== null && togglers.length > 0) {
      CAUtil.on(body, togglers, 'click', function (e) {
        e.preventDefault();
        the.toggleElement = this;

        _toggle();
      });
    }

    if (closers !== null && closers.length > 0) {
      CAUtil.on(body, closers, 'click', function (e) {
        e.preventDefault();
        the.closeElement = this;

        _hide();
      });
    }
  };

  var _toggle = function _toggle() {
    if (CAEventHandler.trigger(the.element, 'ca.drawer.toggle', the) === false) {
      return;
    }

    if (the.shown === true) {
      _hide();
    } else {
      _show();
    }

    CAEventHandler.trigger(the.element, 'ca.drawer.toggled', the);
  };

  var _hide = function _hide() {
    if (CAEventHandler.trigger(the.element, 'ca.drawer.hide', the) === false) {
      return;
    }

    the.shown = false;

    _deleteOverlay();

    body.removeAttribute('data-pdms-drawer-' + the.name, 'on');
    body.removeAttribute('data-pdms-drawer');
    CAUtil.removeClass(the.element, the.options.baseClass + '-on');

    if (the.toggleElement !== null) {
      CAUtil.removeClass(the.toggleElement, 'active');
    }

    CAEventHandler.trigger(the.element, 'ca.drawer.after.hidden', the) === false;
  };

  var _show = function _show() {
    if (CAEventHandler.trigger(the.element, 'ca.drawer.show', the) === false) {
      return;
    }

    the.shown = true;

    _createOverlay();

    body.setAttribute('data-pdms-drawer-' + the.name, 'on');
    body.setAttribute('data-pdms-drawer', 'on');
    CAUtil.addClass(the.element, the.options.baseClass + '-on');

    if (the.toggleElement !== null) {
      CAUtil.addClass(the.toggleElement, 'active');
    }

    CAEventHandler.trigger(the.element, 'ca.drawer.shown', the);
  };

  var _update = function _update() {
    var width = _getWidth();

    var direction = _getOption('direction'); // Reset state


    if (CAUtil.hasClass(the.element, the.options.baseClass + '-on') === true && String(body.getAttribute('data-pdms-drawer-' + the.name + '-')) === 'on') {
      the.shown = true;
    } else {
      the.shown = false;
    } // Activate/deactivate


    if (_getOption('activate') === true) {
      CAUtil.addClass(the.element, the.options.baseClass);
      CAUtil.addClass(the.element, the.options.baseClass + '-' + direction);
      CAUtil.css(the.element, 'width', width, true);
      the.lastWidth = width;
    } else {
      CAUtil.css(the.element, 'width', '');
      CAUtil.removeClass(the.element, the.options.baseClass);
      CAUtil.removeClass(the.element, the.options.baseClass + '-' + direction);

      _hide();
    }
  };

  var _createOverlay = function _createOverlay() {
    if (_getOption('overlay') === true) {
      the.overlayElement = document.createElement('DIV');
      CAUtil.css(the.overlayElement, 'z-index', CAUtil.css(the.element, 'z-index') - 1); // update

      body.append(the.overlayElement);
      CAUtil.addClass(the.overlayElement, _getOption('overlay-class'));
      CAUtil.addEvent(the.overlayElement, 'click', function (e) {
        e.preventDefault();

        _hide();
      });
    }
  };

  var _deleteOverlay = function _deleteOverlay() {
    if (the.overlayElement !== null) {
      CAUtil.remove(the.overlayElement);
    }
  };

  var _getOption = function _getOption(name) {
    if (the.element.hasAttribute('data-pdms-drawer-' + name) === true) {
      var attr = the.element.getAttribute('data-pdms-drawer-' + name);
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

  var _getWidth = function _getWidth() {
    var width = _getOption('width');

    if (width === 'auto') {
      width = CAUtil.css(the.element, 'width');
    }

    return width;
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('drawer');
  }; // Construct class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Plugin API


  the.toggle = function () {
    return _toggle();
  };

  the.show = function () {
    return _show();
  };

  the.hide = function () {
    return _hide();
  };

  the.isShown = function () {
    return the.shown;
  };

  the.update = function () {
    _update();
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


CADrawer.getInstance = function (element) {
  if (element !== null && CAUtil.data(element).has('drawer')) {
    return CAUtil.data(element).get('drawer');
  } else {
    return null;
  }
}; // Hide all drawers and skip one if provided


CADrawer.hideAll = function () {
  var skip = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '[data-pdms-drawer="true"]';
  var items = document.querySelectorAll(selector);

  if (items && items.length > 0) {
    for (var i = 0, len = items.length; i < len; i++) {
      var item = items[i];
      var drawer = CADrawer.getInstance(item);

      if (!drawer) {
        continue;
      }

      if (skip) {
        if (item !== skip) {
          drawer.hide();
        }
      } else {
        drawer.hide();
      }
    }
  }
}; // Update all drawers


CADrawer.updateAll = function () {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-pdms-drawer="true"]';
  var items = document.querySelectorAll(selector);

  if (items && items.length > 0) {
    for (var i = 0, len = items.length; i < len; i++) {
      var item = items[i];
      var drawer = CADrawer.getInstance(item);

      if (drawer) {
        drawer.update();
        ;
      }
    }
  }
}; // Create instances


CADrawer.createInstances = function () {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-pdms-drawer="true"]';
  var body = document.getElementsByTagName("BODY")[0]; // Initialize Menus

  var elements = body.querySelectorAll(selector);
  var drawer;

  if (elements && elements.length > 0) {
    for (var i = 0, len = elements.length; i < len; i++) {
      drawer = new CADrawer(elements[i]);
    }
  }
}; // Toggle instances


CADrawer.handleShow = function () {
  // External drawer toggle handler
  CAUtil.on(document.body, '[data-pdms-drawer-show="true"][data-pdms-drawer-target]', 'click', function (e) {
    var element = document.querySelector(this.getAttribute('data-pdms-drawer-target'));

    if (element) {
      CADrawer.getInstance(element).show();
    }
  });
}; // Dismiss instances


CADrawer.handleDismiss = function () {
  // External drawer toggle handler
  CAUtil.on(document.body, '[data-pdms-drawer-dismiss="true"]', 'click', function (e) {
    var element = this.closest('[data-pdms-drawer="true"]');

    if (element) {
      var drawer = CADrawer.getInstance(element);

      if (drawer.isShown()) {
        drawer.hide();
      }
    }
  });
}; // Window resize Handling


window.addEventListener('resize', function () {
  var timer;
  var body = document.getElementsByTagName("BODY")[0];
  CAUtil.throttle(timer, function () {
    // Locate and update drawer instances on window resize
    var elements = body.querySelectorAll('[data-pdms-drawer="true"]');

    if (elements && elements.length > 0) {
      for (var i = 0, len = elements.length; i < len; i++) {
        var drawer = CADrawer.getInstance(elements[i]);

        if (drawer) {
          drawer.update();
        }
      }
    }
  }, 200);
}); // Global initialization

CADrawer.init = function () {
  CADrawer.createInstances();
  CADrawer.handleShow();
  CADrawer.handleDismiss();
}; // On document ready


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CADrawer.init);
} else {
  CADrawer.init();
} // Webpack support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CADrawer;
}