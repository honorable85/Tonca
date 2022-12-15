"use strict"; // Class definition

var CABlockUI = function CABlockUI(element, options) {
  //////////////////////////////
  // ** Private variables  ** //
  //////////////////////////////
  var the = this;

  if (typeof element === "undefined" || element === null) {
    return;
  } // Default options


  var defaultOptions = {
    zIndex: false,
    overlayClass: '',
    overflow: 'hidden',
    message: '<span class="spinner-border text-primary"></span>'
  }; ////////////////////////////
  // ** Private methods  ** //
  ////////////////////////////

  var _construct = function _construct() {
    if (CAUtil.data(element).has('blockui')) {
      the = CAUtil.data(element).get('blockui');
    } else {
      _init();
    }
  };

  var _init = function _init() {
    // Variables
    the.options = CAUtil.deepExtend({}, defaultOptions, options);
    the.element = element;
    the.overlayElement = null;
    the.blocked = false;
    the.positionChanged = false;
    the.overflowChanged = false; // Bind Instance

    CAUtil.data(the.element).set('blockui', the);
  };

  var _block = function _block() {
    if (CAEventHandler.trigger(the.element, 'ca.blockui.block', the) === false) {
      return;
    }

    var isPage = the.element.tagName === 'BODY';
    var position = CAUtil.css(the.element, 'position');
    var overflow = CAUtil.css(the.element, 'overflow');
    var zIndex = isPage ? 10000 : 1;

    if (the.options.zIndex > 0) {
      zIndex = the.options.zIndex;
    } else {
      if (CAUtil.css(the.element, 'z-index') != 'auto') {
        zIndex = CAUtil.css(the.element, 'z-index');
      }
    }

    the.element.classList.add('blockui');

    if (position === "absolute" || position === "relative" || position === "fixed") {
      CAUtil.css(the.element, 'position', 'relative');
      the.positionChanged = true;
    }

    if (the.options.overflow === 'hidden' && overflow === 'visible') {
      CAUtil.css(the.element, 'overflow', 'hidden');
      the.overflowChanged = true;
    }

    the.overlayElement = document.createElement('DIV');
    the.overlayElement.setAttribute('class', 'blockui-overlay ' + the.options.overlayClass);
    the.overlayElement.innerHTML = the.options.message;
    CAUtil.css(the.overlayElement, 'z-index', zIndex);
    the.element.append(the.overlayElement);
    the.blocked = true;
    CAEventHandler.trigger(the.element, 'ca.blockui.after.blocked', the) === false;
  };

  var _release = function _release() {
    if (CAEventHandler.trigger(the.element, 'ca.blockui.release', the) === false) {
      return;
    }

    the.element.classList.add('blockui');

    if (the.positionChanged) {
      CAUtil.css(the.element, 'position', '');
    }

    if (the.overflowChanged) {
      CAUtil.css(the.element, 'overflow', '');
    }

    if (the.overlayElement) {
      CAUtil.remove(the.overlayElement);
    }

    the.blocked = false;
    CAEventHandler.trigger(the.element, 'ca.blockui.released', the);
  };

  var _isBlocked = function _isBlocked() {
    return the.blocked;
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('blockui');
  }; // Construct class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Plugin API


  the.block = function () {
    _block();
  };

  the.release = function () {
    _release();
  };

  the.isBlocked = function () {
    return _isBlocked();
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


CABlockUI.getInstance = function (element) {
  if (element !== null && CAUtil.data(element).has('blockui')) {
    return CAUtil.data(element).get('blockui');
  } else {
    return null;
  }
}; // Webpack support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CABlockUI;
}