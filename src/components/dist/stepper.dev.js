"use strict"; // Class definition

var CAStepper = function CAStepper(element, options) {
  //////////////////////////////
  // ** Private variables  ** //
  //////////////////////////////
  var the = this;
  var body = document.getElementsByTagName("BODY")[0];

  if (typeof element === "undefined" || element === null) {
    return;
  } // Default Options


  var defaultOptions = {
    startIndex: 1,
    animation: false,
    animationSpeed: '0.3s',
    animationNextClass: 'animate__animated animate__slideInRight animate__fast',
    animationPreviousClass: 'animate__animated animate__slideInLeft animate__fast'
  }; ////////////////////////////
  // ** Private methods  ** //
  ////////////////////////////

  var _construct = function _construct() {
    if (CAUtil.data(element).has('stepper') === true) {
      the = CAUtil.data(element).get('stepper');
    } else {
      _init();
    }
  };

  var _init = function _init() {
    the.options = CAUtil.deepExtend({}, defaultOptions, options);
    the.uid = CAUtil.getUniqueId('stepper');
    the.element = element; // Set initialized

    the.element.setAttribute('data-pdms-stepper', 'true'); // Elements

    the.steps = CAUtil.findAll(the.element, '[data-pdms-stepper-element="nav"]');
    the.btnNext = CAUtil.find(the.element, '[data-pdms-stepper-action="next"]');
    the.btnPrevious = CAUtil.find(the.element, '[data-pdms-stepper-action="previous"]');
    the.btnSubmit = CAUtil.find(the.element, '[data-pdms-stepper-action="submit"]'); // Variables

    the.totalStepsNumber = the.steps.length;
    the.passedStepIndex = 0;
    the.currentStepIndex = 1;
    the.clickedStepIndex = 0; // Set Current Step

    if (the.options.startIndex > 1) {
      _goTo(the.options.startIndex);
    } // Event Handlers


    CAUtil.addEvent(the.btnNext, 'click', function (e) {
      e.preventDefault();
      CAEventHandler.trigger(the.element, 'ca.stepper.next', the);
    });
    CAUtil.addEvent(the.btnPrevious, 'click', function (e) {
      e.preventDefault();
      CAEventHandler.trigger(the.element, 'ca.stepper.previous', the);
    });
    CAUtil.on(the.element, '[data-pdms-stepper-action="step"]', 'click', function (e) {
      e.preventDefault();

      if (the.steps && the.steps.length > 0) {
        for (var i = 0, len = the.steps.length; i < len; i++) {
          if (the.steps[i] === this) {
            the.clickedStepIndex = i + 1;
            CAEventHandler.trigger(the.element, 'ca.stepper.click', the);
            return;
          }
        }
      }
    }); // Bind Instance

    CAUtil.data(the.element).set('stepper', the);
  };

  var _goTo = function _goTo(index) {
    // Trigger "change" event
    CAEventHandler.trigger(the.element, 'ca.stepper.change', the); // Skip if this step is already shown

    if (index === the.currentStepIndex || index > the.totalStepsNumber || index < 0) {
      return;
    } // Validate step number


    index = parseInt(index); // Set current step

    the.passedStepIndex = the.currentStepIndex;
    the.currentStepIndex = index; // Refresh elements

    _refreshUI(); // Trigger "changed" event


    CAEventHandler.trigger(the.element, 'ca.stepper.changed', the);
    return the;
  };

  var _goNext = function _goNext() {
    return _goTo(_getNextStepIndex());
  };

  var _goPrevious = function _goPrevious() {
    return _goTo(_getPreviousStepIndex());
  };

  var _goLast = function _goLast() {
    return _goTo(_getLastStepIndex());
  };

  var _goFirst = function _goFirst() {
    return _goTo(_getFirstStepIndex());
  };

  var _refreshUI = function _refreshUI() {
    var state = '';

    if (_isLastStep()) {
      state = 'last';
    } else if (_isFirstStep()) {
      state = 'first';
    } else {
      state = 'between';
    } // Set state class


    CAUtil.removeClass(the.element, 'last');
    CAUtil.removeClass(the.element, 'first');
    CAUtil.removeClass(the.element, 'between');
    CAUtil.addClass(the.element, state); // Step Items

    var elements = CAUtil.findAll(the.element, '[data-pdms-stepper-element="nav"], [data-pdms-stepper-element="content"], [data-pdms-stepper-element="info"]');

    if (elements && elements.length > 0) {
      for (var i = 0, len = elements.length; i < len; i++) {
        var element = elements[i];
        var index = CAUtil.index(element) + 1;
        CAUtil.removeClass(element, 'current');
        CAUtil.removeClass(element, 'completed');
        CAUtil.removeClass(element, 'pending');

        if (index == the.currentStepIndex) {
          CAUtil.addClass(element, 'current');

          if (the.options.animation !== false && element.getAttribute('data-pdms-stepper-element') == 'content') {
            CAUtil.css(element, 'animationDuration', the.options.animationSpeed);
            var animation = _getStepDirection(the.passedStepIndex) === 'previous' ? the.options.animationPreviousClass : the.options.animationNextClass;
            CAUtil.animateClass(element, animation);
          }
        } else {
          if (index < the.currentStepIndex) {
            CAUtil.addClass(element, 'completed');
          } else {
            CAUtil.addClass(element, 'pending');
          }
        }
      }
    }
  };

  var _isLastStep = function _isLastStep() {
    return the.currentStepIndex === the.totalStepsNumber;
  };

  var _isFirstStep = function _isFirstStep() {
    return the.currentStepIndex === 1;
  };

  var _isBetweenStep = function _isBetweenStep() {
    return _isLastStep() === false && _isFirstStep() === false;
  };

  var _getNextStepIndex = function _getNextStepIndex() {
    if (the.totalStepsNumber >= the.currentStepIndex + 1) {
      return the.currentStepIndex + 1;
    } else {
      return the.totalStepsNumber;
    }
  };

  var _getPreviousStepIndex = function _getPreviousStepIndex() {
    if (the.currentStepIndex - 1 > 1) {
      return the.currentStepIndex - 1;
    } else {
      return 1;
    }
  };

  var _getFirstStepIndex = function _getFirstStepIndex() {
    return 1;
  };

  var _getLastStepIndex = function _getLastStepIndex() {
    return the.totalStepsNumber;
  };

  var _getTotalStepsNumber = function _getTotalStepsNumber() {
    return the.totalStepsNumber;
  };

  var _getStepDirection = function _getStepDirection(index) {
    if (index > the.currentStepIndex) {
      return 'next';
    } else {
      return 'previous';
    }
  };

  var _getStepContent = function _getStepContent(index) {
    var content = CAUtil.findAll(the.element, '[data-pdms-stepper-element="content"]');

    if (content[index - 1]) {
      return content[index - 1];
    } else {
      return false;
    }
  };

  var _destroy = function _destroy() {
    CAUtil.data(the.element).remove('stepper');
  }; // Construct Class


  _construct(); ///////////////////////
  // ** Public API  ** //
  ///////////////////////
  // Plugin API


  the.getElement = function (index) {
    return the.element;
  };

  the.goTo = function (index) {
    return _goTo(index);
  };

  the.goPrevious = function () {
    return _goPrevious();
  };

  the.goNext = function () {
    return _goNext();
  };

  the.goFirst = function () {
    return _goFirst();
  };

  the.goLast = function () {
    return _goLast();
  };

  the.getCurrentStepIndex = function () {
    return the.currentStepIndex;
  };

  the.getNextStepIndex = function () {
    return the.nextStepIndex;
  };

  the.getPassedStepIndex = function () {
    return the.passedStepIndex;
  };

  the.getClickedStepIndex = function () {
    return the.clickedStepIndex;
  };

  the.getPreviousStepIndex = function () {
    return the.PreviousStepIndex;
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


CAStepper.getInstance = function (element) {
  if (element !== null && CAUtil.data(element).has('stepper')) {
    return CAUtil.data(element).get('stepper');
  } else {
    return null;
  }
}; // Webpack support


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = CAStepper;
}