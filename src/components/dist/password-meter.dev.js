"use strict"; // Class definition

var CAPasswordMeter = function CAPasswordMeter(element, options) {
  ////////////////////////////
  // ** Private variables  ** //
  ////////////////////////////
  var the = this;

  if (!element) {
    return;
  } // Default Options


  var defaultOptions = {
    minLength: 8,
    checkUppercase: true,
    checkLowercase: true,
    checkDigit: true,
    checkChar: true,
    scoreHighlightClass: 'active'
  }; ////////////////////////////
  // ** Private methods  ** //
  ////////////////////////////
  // Constructor

  var _construct = function _construct() {
    if (CAUtil.data(element).has('password-meter') === true) {
      the = CAUtil.data(element).get('password-meter');
    } else {
      _init();
    }
  }; // Initialize


  var _init = function _init() {
    // Variables
    the.options = CAUtil.deepExtend({}, defaultOptions, options);
    the.score = 0;
    the.checkSteps = 5; // Elements

    the.element = element;
    the.inputElement = the.element.querySelector('input[type]');
    the.visibilityElement = the.element.querySelector('[data-pdms-password-meter-control="visibility"]');
    the.highlightElement = the.element.querySelector('[data-pdms-password-meter-control="highlight"]'); // Set initialized

    the.element.setAttribute('data-pdms-password-meter', 'true'); // Event Handlers

    _handlers(); // Bind Instance


    CAUtil.data(the.element).set('password-meter', the);
  }; // Handlers


  var _handlers = function _handlers() {
    the.inputElement.addEventListener('input', function () {
      _check();
    });

    if (the.visibilityElement) {
      the.visibilityElement.addEventListener('click', function () {
        _visibility();
      });
    }
  }; // Event handlers


  var _check = function _check() {
    var score = 0;

    var checkScore = _getCheckScore();

    if (_checkLength() === true) {
      score = score + checkScore;
    }

    if (the.options.checkUppercase === true && _checkLowercase() === true) {
      score = score + checkScore;
    }

    if (the.options.checkLowercase === true && _checkUppercase() === true) {
      score = score + checkScore;
    }

    if (the.options.checkDigit === true && _checkDigit() === true) {
      score = score + checkScore;
    }

    if (the.options.checkChar === true && _checkChar() === true) {
      score = score + checkScore;
    }

    the.score = score;

    _highlight();
  };

  var _checkLength = function _checkLength() {
    return the.inputElement.value.length >= the.options.minLength; // 20 score
  };

  var _checkLowercase = function _checkLowercase() {
    return /[a-z]/.test(the.inputElement.value); // 20 score
  };

  var _checkUppercase = function _checkUppercase() {
    return /[A-Z]/.test(the.inputElement.value); // 20 score
  };

  var _checkDigit = function _checkDigit() {
    return /[0-9]/.test(the.inputElement.value); // 20 score
  };

  var _checkChar = function _checkChar() {
    return /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(the.inputElement.value); // 20 score
  };

  var _getCheckScore = function _getCheckScore() {
    var count = 1;

    if (the.options.checkUppercase === true) {
      count++;
    }

    if (the.options.checkLowercase === true) {
      count++;
    }

    if (the.options.checkDigit === true) {
      count++;
    }

    if (the.options.checkChar === true) {
      count++;
    }

    the.checkSteps = count;
    return 100 / the.checkSteps;
  };

  var _highlight = function _highlight() {
    var items = [].slice.call(the.highlightElement.querySelectorAll('div'));
    var total = items.length;
    var index = 0;

    var checkScore = _getCheckScore();

    var score = _getScore();

    items.map(function (item) {
      index++;

      if (checkScore * index * (the.checkSteps / total) <= score) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  };

  var _visibility = function _visibility() {
    var visibleIcon = the.visibilityElement.querySelector('i:not(.d-none), .svg-icon:not(.d-none)');
    var hiddenIcon = the.visibilityElement.querySelector('i.d-none, .svg-icon.d-none');

    if (the.inputElement.getAttribute('type').toLowerCase() === 'password') {
      the.inputElement.setAttribute('type', 'text');
    } else {
      the.inputElement.setAttribute('type', 'password');
    }

    visibleIcon.classList.add('d-none');
    hiddenIcon.classList.remove('d-none');
    the.inputElement.focus();
  };

  var _reset = function _reset() {
    the.score = 0;

    _highlight();
  }; // Gets current password score


  var _getScore = function _getScore() {
    return the.score;
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('password-meter');
  }; // Construct class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Plugin API


  the.check = function () {
    return _check();
  };

  the.getScore = function () {
    return _getScore();
  };

  the.reset = function () {
    return _reset();
  };

  the.destroy = function () {
    return _destroy();
  };
}; // Static methods


CAPasswordMeter.getInstance = function (element) {
  if (element !== null && CAUtil.data(element).has('password-meter')) {
    return CAUtil.data(element).get('password-meter');
  } else {
    return null;
  }
}; // Create instances


CAPasswordMeter.createInstances = function () {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-pdms-password-meter]';
  // Get instances
  var elements = document.body.querySelectorAll(selector);

  if (elements && elements.length > 0) {
    for (var i = 0, len = elements.length; i < len; i++) {
      // Initialize instances
      new CAPasswordMeter(elements[i]);
    }
  }
}; // Global initialization


CAPasswordMeter.init = function () {
  CAPasswordMeter.createInstances();
}; // On document ready


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CAPasswordMeter.init);
} else {
  CAPasswordMeter.init();
} // Webpack support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CAPasswordMeter;
}