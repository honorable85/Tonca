"use strict"; // Class definition

var CAImageInput = function CAImageInput(element, options) {
  ////////////////////////////
  // ** Private Variables  ** //
  ////////////////////////////
  var the = this;

  if (typeof element === "undefined" || element === null) {
    return;
  } // Default Options


  var defaultOptions = {}; ////////////////////////////
  // ** Private Methods  ** //
  ////////////////////////////

  var _construct = function _construct() {
    if (CAUtil.data(element).has('image-input') === true) {
      the = CAUtil.data(element).get('image-input');
    } else {
      _init();
    }
  };

  var _init = function _init() {
    // Variables
    the.options = CAUtil.deepExtend({}, defaultOptions, options);
    the.uid = CAUtil.getUniqueId('image-input'); // Elements

    the.element = element;
    the.inputElement = CAUtil.find(element, 'input[type="file"]');
    the.wrapperElement = CAUtil.find(element, '.image-input-wrapper');
    the.cancelElement = CAUtil.find(element, '[data-pdms-image-input-action="cancel"]');
    the.removeElement = CAUtil.find(element, '[data-pdms-image-input-action="remove"]');
    the.hiddenElement = CAUtil.find(element, 'input[type="hidden"]');
    the.src = CAUtil.css(the.wrapperElement, 'backgroundImage'); // Set initialized

    the.element.setAttribute('data-pdms-image-input', 'true'); // Event Handlers

    _handlers(); // Bind Instance


    CAUtil.data(the.element).set('image-input', the);
  }; // Init Event Handlers


  var _handlers = function _handlers() {
    CAUtil.addEvent(the.inputElement, 'change', _change);
    CAUtil.addEvent(the.cancelElement, 'click', _cancel);
    CAUtil.addEvent(the.removeElement, 'click', _remove);
  }; // Event Handlers


  var _change = function _change(e) {
    e.preventDefault();

    if (the.inputElement !== null && the.inputElement.files && the.inputElement.files[0]) {
      // Fire change event
      if (CAEventHandler.trigger(the.element, 'ca.imageinput.change', the) === false) {
        return;
      }

      var reader = new FileReader();

      reader.onload = function (e) {
        CAUtil.css(the.wrapperElement, 'background-image', 'url(' + e.target.result + ')');
      };

      reader.readAsDataURL(the.inputElement.files[0]);
      CAUtil.addClass(the.element, 'image-input-changed');
      CAUtil.removeClass(the.element, 'image-input-empty'); // Fire removed event

      CAEventHandler.trigger(the.element, 'ca.imageinput.changed', the);
    }
  };

  var _cancel = function _cancel(e) {
    e.preventDefault(); // Fire cancel event

    if (CAEventHandler.trigger(the.element, 'ca.imageinput.cancel', the) === false) {
      return;
    }

    CAUtil.removeClass(the.element, 'image-input-changed');
    CAUtil.removeClass(the.element, 'image-input-empty');
    CAUtil.css(the.wrapperElement, 'background-image', the.src);
    the.inputElement.value = "";

    if (the.hiddenElement !== null) {
      the.hiddenElement.value = "0";
    } // Fire canceled event


    CAEventHandler.trigger(the.element, 'ca.imageinput.canceled', the);
  };

  var _remove = function _remove(e) {
    e.preventDefault(); // Fire remove event

    if (CAEventHandler.trigger(the.element, 'ca.imageinput.remove', the) === false) {
      return;
    }

    CAUtil.removeClass(the.element, 'image-input-changed');
    CAUtil.addClass(the.element, 'image-input-empty');
    CAUtil.css(the.wrapperElement, 'background-image', "none");
    the.inputElement.value = "";

    if (the.hiddenElement !== null) {
      the.hiddenElement.value = "1";
    } // Fire removed event


    CAEventHandler.trigger(the.element, 'ca.imageinput.removed', the);
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('image-input');
  }; // Construct Class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Plugin API


  the.getInputElement = function () {
    return the.inputElement;
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


CAImageInput.getInstance = function (element) {
  if (element !== null && CAUtil.data(element).has('image-input')) {
    return CAUtil.data(element).get('image-input');
  } else {
    return null;
  }
}; // Create instances


CAImageInput.createInstances = function () {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-pdms-image-input]';
  // Initialize Menus
  var elements = document.querySelectorAll(selector);

  if (elements && elements.length > 0) {
    for (var i = 0, len = elements.length; i < len; i++) {
      new CAImageInput(elements[i]);
    }
  }
}; // Global initialization


CAImageInput.init = function () {
  CAImageInput.createInstances();
}; // On document ready


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CAImageInput.init);
} else {
  CAImageInput.init();
} // Webpack Support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CAImageInput;
}