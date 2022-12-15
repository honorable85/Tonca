"use strict"; // Class definition

var CAFeedback = function CAFeedback(options) {
  ////////////////////////////
  // ** Private Variables  ** //
  ////////////////////////////
  var the = this;
  var body = document.getElementsByTagName("BODY")[0]; // Default options

  var defaultOptions = {
    'width': 100,
    'placement': 'top-center',
    'content': '',
    'type': 'popup'
  }; ////////////////////////////
  // ** Private methods  ** //
  ////////////////////////////

  var _construct = function _construct() {
    _init();
  };

  var _init = function _init() {
    // Variables
    the.options = CAUtil.deepExtend({}, defaultOptions, options);
    the.uid = CAUtil.getUniqueId('feedback');
    the.element;
    the.shown = false; // Event Handlers

    _handlers(); // Bind Instance


    CAUtil.data(the.element).set('feedback', the);
  };

  var _handlers = function _handlers() {
    CAUtil.addEvent(the.element, 'click', function (e) {
      e.preventDefault();

      _go();
    });
  };

  var _show = function _show() {
    if (CAEventHandler.trigger(the.element, 'ca.feedback.show', the) === false) {
      return;
    }

    if (the.options.type === 'popup') {
      _showPopup();
    }

    CAEventHandler.trigger(the.element, 'ca.feedback.shown', the);
    return the;
  };

  var _hide = function _hide() {
    if (CAEventHandler.trigger(the.element, 'ca.feedback.hide', the) === false) {
      return;
    }

    if (the.options.type === 'popup') {
      _hidePopup();
    }

    the.shown = false;
    CAEventHandler.trigger(the.element, 'ca.feedback.hidden', the);
    return the;
  };

  var _showPopup = function _showPopup() {
    the.element = document.createElement("DIV");
    CAUtil.addClass(the.element, 'feedback feedback-popup');
    CAUtil.setHTML(the.element, the.options.content);

    if (the.options.placement == 'top-center') {
      _setPopupTopCenterPosition();
    }

    body.appendChild(the.element);
    CAUtil.addClass(the.element, 'feedback-shown');
    the.shown = true;
  };

  var _setPopupTopCenterPosition = function _setPopupTopCenterPosition() {
    var width = CAUtil.getResponsiveValue(the.options.width);
    var height = CAUtil.css(the.element, 'height');
    CAUtil.addClass(the.element, 'feedback-top-center');
    CAUtil.css(the.element, 'width', width);
    CAUtil.css(the.element, 'left', '50%');
    CAUtil.css(the.element, 'top', '-' + height);
  };

  var _hidePopup = function _hidePopup() {
    the.element.remove();
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('feedback');
  }; // Construct class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Plugin API


  the.show = function () {
    return _show();
  };

  the.hide = function () {
    return _hide();
  };

  the.isShown = function () {
    return the.shown;
  };

  the.getElement = function () {
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
}; // Webpack support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CAFeedback;
}