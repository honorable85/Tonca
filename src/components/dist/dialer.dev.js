"use strict"; // Class definition

var CADialer = function CADialer(element, options) {
  ////////////////////////////
  // ** Private variables  ** //
  ////////////////////////////
  var the = this;

  if (!element) {
    return;
  } // Default options


  var defaultOptions = {
    min: null,
    max: null,
    step: 1,
    decimals: 0,
    prefix: "",
    suffix: ""
  }; ////////////////////////////
  // ** Private methods  ** //
  ////////////////////////////
  // Constructor

  var _construct = function _construct() {
    if (CAUtil.data(element).has('dialer') === true) {
      the = CAUtil.data(element).get('dialer');
    } else {
      _init();
    }
  }; // Initialize


  var _init = function _init() {
    // Variables
    the.options = CAUtil.deepExtend({}, defaultOptions, options); // Elements

    the.element = element;
    the.incElement = the.element.querySelector('[data-pdms-dialer-control="increase"]');
    the.decElement = the.element.querySelector('[data-pdms-dialer-control="decrease"]');
    the.inputElement = the.element.querySelector('input[type]'); // Set Values

    if (_getOption('decimals')) {
      the.options.decimals = parseInt(_getOption('decimals'));
    }

    if (_getOption('prefix')) {
      the.options.prefix = _getOption('prefix');
    }

    if (_getOption('suffix')) {
      the.options.suffix = _getOption('suffix');
    }

    if (_getOption('step')) {
      the.options.step = parseFloat(_getOption('step'));
    }

    if (_getOption('min')) {
      the.options.min = parseFloat(_getOption('min'));
    }

    if (_getOption('max')) {
      the.options.max = parseFloat(_getOption('max'));
    }

    the.value = parseFloat(the.inputElement.value.replace(/[^\d.]/g, ''));

    _setValue(); // Event Handlers


    _handlers(); // Bind Instance


    CAUtil.data(the.element).set('dialer', the);
  }; // Handlers


  var _handlers = function _handlers() {
    CAUtil.addEvent(the.incElement, 'click', function (e) {
      e.preventDefault();

      _increase();
    });
    CAUtil.addEvent(the.decElement, 'click', function (e) {
      e.preventDefault();

      _decrease();
    });
    CAUtil.addEvent(the.inputElement, 'change', function (e) {
      e.preventDefault();

      _setValue();
    });
  }; // Event handlers


  var _increase = function _increase() {
    // Trigger "after.dialer" event
    CAEventHandler.trigger(the.element, 'ca.dialer.increase', the);
    the.inputElement.value = the.value + the.options.step;

    _setValue(); // Trigger "before.dialer" event


    CAEventHandler.trigger(the.element, 'ca.dialer.increased', the);
    return the;
  };

  var _decrease = function _decrease() {
    // Trigger "after.dialer" event
    CAEventHandler.trigger(the.element, 'ca.dialer.decrease', the);
    the.inputElement.value = the.value - the.options.step;

    _setValue(); // Trigger "before.dialer" event


    CAEventHandler.trigger(the.element, 'ca.dialer.decreased', the);
    return the;
  }; // Set Input Value


  var _setValue = function _setValue() {
    // Trigger "after.dialer" event
    CAEventHandler.trigger(the.element, 'ca.dialer.change', the);
    the.value = parseFloat(the.inputElement.value.replace(/[^\d.]/g, ''));

    if (the.value < the.options.min) {
      the.value = the.options.min;
    }

    if (the.value > the.options.max) {
      the.value = the.options.max;
    }

    the.inputElement.value = _format(the.value); // Trigger "after.dialer" event

    CAEventHandler.trigger(the.element, 'ca.dialer.changed', the);
  }; // Format


  var _format = function _format(val) {
    return the.options.prefix + parseFloat(val).toFixed(the.options.decimals) + the.options.suffix;
  }; // Get option


  var _getOption = function _getOption(name) {
    if (the.element.hasAttribute('data-pdms-dialer-' + name) === true) {
      var attr = the.element.getAttribute('data-pdms-dialer-' + name);
      var value = attr;
      return value;
    } else {
      return null;
    }
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('dialer');
  }; // Construct class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Plugin API


  the.increase = function () {
    return _increase();
  };

  the.decrease = function () {
    return _decrease();
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
}; // Static methods


CADialer.getInstance = function (element) {
  if (element !== null && CAUtil.data(element).has('dialer')) {
    return CAUtil.data(element).get('dialer');
  } else {
    return null;
  }
}; // Create instances


CADialer.createInstances = function () {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-pdms-dialer="true"]';
  // Get instances
  var elements = document.body.querySelectorAll(selector);

  if (elements && elements.length > 0) {
    for (var i = 0, len = elements.length; i < len; i++) {
      // Initialize instances
      new CADialer(elements[i]);
    }
  }
}; // Global initialization


CADialer.init = function () {
  CADialer.createInstances();
}; // On document ready


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CADialer.init);
} else {
  CADialer.init();
} // Webpack support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CADialer;
}