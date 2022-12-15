"use strict"; // Class definition

var CASearch = function CASearch(element, options) {
  ////////////////////////////
  // ** Private variables  ** //
  ////////////////////////////
  var the = this;

  if (!element) {
    return;
  } // Default Options


  var defaultOptions = {
    minLength: 2,
    // Miniam text lenght to query search
    keypress: true,
    // Enable search on keypress 
    enter: true,
    // Enable search on enter key press
    layout: 'menu',
    // Use 'menu' or 'inline' layout options to display search results
    responsive: null,
    // Pass integer value or bootstrap compatible breakpoint key(sm,md,lg,xl,xxl) to enable reponsive form mode for device width below the breakpoint value
    showOnFocus: true // Always show menu on input focus

  }; ////////////////////////////
  // ** Private methods  ** //
  ////////////////////////////
  // Construct

  var _construct = function _construct() {
    if (CAUtil.data(element).has('search') === true) {
      the = CAUtil.data(element).get('search');
    } else {
      _init();
    }
  }; // Init


  var _init = function _init() {
    // Variables
    the.options = CAUtil.deepExtend({}, defaultOptions, options);
    the.processing = false; // Elements

    the.element = element;
    the.contentElement = _getElement('content');
    the.formElement = _getElement('form');
    the.inputElement = _getElement('input');
    the.spinnerElement = _getElement('spinner');
    the.clearElement = _getElement('clear');
    the.toggleElement = _getElement('toggle');
    the.submitElement = _getElement('submit');
    the.toolbarElement = _getElement('toolbar');
    the.resultsElement = _getElement('results');
    the.suggestionElement = _getElement('suggestion');
    the.emptyElement = _getElement('empty'); // Set initialized

    the.element.setAttribute('data-pdms-search', 'true'); // Layout

    the.layout = _getOption('layout'); // Menu

    if (the.layout === 'menu') {
      the.menuObject = new CAMenu(the.contentElement);
    } else {
      the.menuObject = null;
    } // Update


    _update(); // Event Handlers


    _handlers(); // Bind Instance


    CAUtil.data(the.element).set('search', the);
  }; // Handlera


  var _handlers = function _handlers() {
    // Focus
    the.inputElement.addEventListener('focus', _focus); // Blur

    the.inputElement.addEventListener('blur', _blur); // Keypress

    if (_getOption('keypress') === true) {
      the.inputElement.addEventListener('input', _input);
    } // Submit


    if (the.submitElement) {
      the.submitElement.addEventListener('click', _search);
    } // Enter


    if (_getOption('enter') === true) {
      the.inputElement.addEventListener('keypress', _enter);
    } // Clear 


    if (the.clearElement) {
      the.clearElement.addEventListener('click', _clear);
    } // Menu


    if (the.menuObject) {
      // Toggle menu
      if (the.toggleElement) {
        the.toggleElement.addEventListener('click', _show);
        the.menuObject.on('ca.menu.dropdown.show', function (item) {
          if (CAUtil.visible(the.toggleElement)) {
            the.toggleElement.classList.add('active');
            the.toggleElement.classList.add('show');
          }
        });
        the.menuObject.on('ca.menu.dropdown.hide', function (item) {
          if (CAUtil.visible(the.toggleElement)) {
            the.toggleElement.classList.remove('active');
            the.toggleElement.classList.remove('show');
          }
        });
      }

      the.menuObject.on('ca.menu.dropdown.shown', function () {
        the.inputElement.focus();
      });
    } // Window resize handling


    window.addEventListener('resize', function () {
      var timer;
      CAUtil.throttle(timer, function () {
        _update();
      }, 200);
    });
  }; // Focus


  var _focus = function _focus() {
    the.element.classList.add('focus');

    if (_getOption('show-on-focus') === true || the.inputElement.value.length >= minLength) {
      _show();
    }
  }; // Blur


  var _blur = function _blur() {
    the.element.classList.remove('focus');
  }; // Enter 


  var _enter = function _enter(e) {
    var key = e.charCode || e.keyCode || 0;

    if (key == 13) {
      e.preventDefault();

      _search();
    }
  }; // Input


  var _input = function _input() {
    if (_getOption('min-length')) {
      var minLength = parseInt(_getOption('min-length'));

      if (the.inputElement.value.length >= minLength) {
        _search();
      } else if (the.inputElement.value.length === 0) {
        _clear();
      }
    }
  }; // Search


  var _search = function _search() {
    if (the.processing === false) {
      // Show search spinner
      if (the.spinnerElement) {
        the.spinnerElement.classList.remove("d-none");
      } // Hide search clear button


      if (the.clearElement) {
        the.clearElement.classList.add("d-none");
      } // Hide search toolbar


      if (the.toolbarElement && the.formElement.contains(the.toolbarElement)) {
        the.toolbarElement.classList.add("d-none");
      } // Focus input


      the.inputElement.focus();
      the.processing = true;
      CAEventHandler.trigger(the.element, 'ca.search.process', the);
    }
  }; // Complete


  var _complete = function _complete() {
    if (the.spinnerElement) {
      the.spinnerElement.classList.add("d-none");
    } // Show search toolbar


    if (the.clearElement) {
      the.clearElement.classList.remove("d-none");
    }

    if (the.inputElement.value.length === 0) {
      _clear();
    } // Focus input


    the.inputElement.focus();

    _show();

    the.processing = false;
  }; // Clear


  var _clear = function _clear() {
    if (CAEventHandler.trigger(the.element, 'ca.search.clear', the) === false) {
      return;
    } // Clear and focus input


    the.inputElement.value = "";
    the.inputElement.focus(); // Hide clear icon

    if (the.clearElement) {
      the.clearElement.classList.add("d-none");
    } // Show search toolbar


    if (the.toolbarElement && the.formElement.contains(the.toolbarElement)) {
      the.toolbarElement.classList.remove("d-none");
    } // Hide menu


    if (_getOption('show-on-focus') === false) {
      _hide();
    }

    CAEventHandler.trigger(the.element, 'ca.search.cleared', the);
  }; // Update


  var _update = function _update() {
    // Handle responsive form
    if (the.layout === 'menu') {
      var responsiveFormMode = _getResponsiveFormMode();

      if (responsiveFormMode === 'on' && the.contentElement.contains(the.formElement) === false) {
        the.contentElement.prepend(the.formElement);
        the.formElement.classList.remove('d-none');
      } else if (responsiveFormMode === 'off' && the.contentElement.contains(the.formElement) === true) {
        the.element.prepend(the.formElement);
        the.formElement.classList.add('d-none');
      }
    }
  }; // Show menu


  var _show = function _show() {
    if (the.menuObject) {
      _update();

      the.menuObject.show(the.element);
    }
  }; // Hide menu


  var _hide = function _hide() {
    if (the.menuObject) {
      _update();

      the.menuObject.hide(the.element);
    }
  }; // Get option


  var _getOption = function _getOption(name) {
    if (the.element.hasAttribute('data-pdms-search-' + name) === true) {
      var attr = the.element.getAttribute('data-pdms-search-' + name);
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
  }; // Get element


  var _getElement = function _getElement(name) {
    return the.element.querySelector('[data-pdms-search-element="' + name + '"]');
  }; // Check if responsive form mode is enabled


  var _getResponsiveFormMode = function _getResponsiveFormMode() {
    var responsive = _getOption('responsive');

    var width = CAUtil.getViewPort().width;

    if (!responsive) {
      return null;
    }

    var breakpoint = CAUtil.getBreakpoint(responsive);

    if (!breakpoint) {
      breakpoint = parseInt(responsive);
    }

    if (width < breakpoint) {
      return "on";
    } else {
      return "off";
    }
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('search');
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

  the.update = function () {
    return _update();
  };

  the.search = function () {
    return _search();
  };

  the.complete = function () {
    return _complete();
  };

  the.clear = function () {
    return _clear();
  };

  the.isProcessing = function () {
    return the.processing;
  };

  the.getQuery = function () {
    return the.inputElement.value;
  };

  the.getMenu = function () {
    return the.menuObject;
  };

  the.getFormElement = function () {
    return the.formElement;
  };

  the.getInputElement = function () {
    return the.inputElement;
  };

  the.getContentElement = function () {
    return the.contentElement;
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
}; // Static methods


CASearch.getInstance = function (element) {
  if (element !== null && CAUtil.data(element).has('search')) {
    return CAUtil.data(element).get('search');
  } else {
    return null;
  }
}; // Webpack support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CASearch;
}