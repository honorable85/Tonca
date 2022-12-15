"use strict";

// Class definition
var $Stepper = function(element, options) {
    //////////////////////////////
    // ** Private variables  ** //
    //////////////////////////////
    var the = this;
    var body = document.getElementsByTagName("BODY")[0];

    if ( typeof element === "undefined" || element === null ) {
        return;
    }

    // Default Options
    var defaultOptions = {
        startIndex: 1,
        animation: false,
        animationSpeed: '0.3s',
        animationNextClass: 'animate__animated animate__slideInRight animate__fast',
        animationPreviousClass: 'animate__animated animate__slideInLeft animate__fast'
    };

    ////////////////////////////
    // ** Private methods  ** //
    ////////////////////////////

    var _construct = function() {
        if ( $Util.data(element).has('stepper') === true ) {
            the = $Util.data(element).get('stepper');
        } else {
            _init();
        }
    }

    var _init = function() {
        the.options = $Util.deepExtend({}, defaultOptions, options);
        the.uid = $Util.getUniqueId('stepper');

        the.element = element;

        // Set initialized
        the.element.setAttribute('data-pdms-stepper', 'true');

        // Elements
        the.steps = $Util.findAll(the.element, '[data-pdms-stepper-element="nav"]');
        the.btnNext = $Util.find(the.element, '[data-pdms-stepper-action="next"]');
        the.btnPrevious = $Util.find(the.element, '[data-pdms-stepper-action="previous"]');
        the.btnSubmit = $Util.find(the.element, '[data-pdms-stepper-action="submit"]');

        // Variables
        the.totalStepsNumber = the.steps.length;
        the.passedStepIndex = 0;
        the.currentStepIndex = 1;
        the.clickedStepIndex = 0;

        // Set Current Step
        if ( the.options.startIndex > 1 ) {
            _goTo(the.options.startIndex);
        }

        // Event Handlers
        $Util.addEvent(the.btnNext, 'click', function(e) {
            e.preventDefault();

            $EventHandler.trigger(the.element, 'pdms.stepper.next', the);
        });

        $Util.addEvent(the.btnPrevious, 'click', function(e) {
            e.preventDefault();

            $EventHandler.trigger(the.element, 'pdms.stepper.previous', the);
        });

        $Util.on(the.element, '[data-pdms-stepper-action="step"]', 'click', function(e) {
            e.preventDefault();

            if ( the.steps && the.steps.length > 0 ) {
                for (var i = 0, len = the.steps.length; i < len; i++) {
                    if ( the.steps[i] === this ) {
                        the.clickedStepIndex = i + 1;

                        $EventHandler.trigger(the.element, 'pdms.stepper.click', the);

                        return;
                    }
                }
            }
        });

        // Bind Instance
        $Util.data(the.element).set('stepper', the);
    }

    var _goTo = function(index) {
        // Trigger "change" event
        $EventHandler.trigger(the.element, 'pdms.stepper.change', the);

        // Skip if this step is already shown
        if ( index === the.currentStepIndex || index > the.totalStepsNumber || index < 0 ) {
            return;
        }

        // Validate step number
        index = parseInt(index);

        // Set current step
        the.passedStepIndex = the.currentStepIndex;
        the.currentStepIndex = index;

        // Refresh elements
        _refreshUI();

        // Trigger "changed" event
        $EventHandler.trigger(the.element, 'pdms.stepper.changed', the);

        return the;
    }

    var _goNext = function() {
        return _goTo( _getNextStepIndex() );
    }

    var _goPrevious = function() {
        return _goTo( _getPreviousStepIndex() );
    }

    var _goLast = function() {
        return _goTo( _getLastStepIndex() );
    }

    var _goFirst = function() {
        return _goTo( _getFirstStepIndex() );
    }

    var _refreshUI = function() {
        var state = '';

        if ( _isLastStep() ) {
            state = 'last';
        } else if ( _isFirstStep() ) {
            state = 'first';
        } else {
            state = 'between';
        }

        // Set state class
        $Util.removeClass(the.element, 'last');
        $Util.removeClass(the.element, 'first');
        $Util.removeClass(the.element, 'between');

        $Util.addClass(the.element, state);

        // Step Items
        var elements = $Util.findAll(the.element, '[data-pdms-stepper-element="nav"], [data-pdms-stepper-element="content"], [data-pdms-stepper-element="info"]');

        if ( elements && elements.length > 0 ) {
            for (var i = 0, len = elements.length; i < len; i++) {
                var element = elements[i];
                var index = $Util.index(element) + 1;

                $Util.removeClass(element, 'current');
                $Util.removeClass(element, 'completed');
                $Util.removeClass(element, 'pending');

                if ( index == the.currentStepIndex ) {
                    $Util.addClass(element, 'current');

                    if ( the.options.animation !== false && element.getAttribute('data-pdms-stepper-element') == 'content' ) {
                        $Util.css(element, 'animationDuration', the.options.animationSpeed);

                        var animation = _getStepDirection(the.passedStepIndex) === 'previous' ?  the.options.animationPreviousClass : the.options.animationNextClass;
                        $Util.animateClass(element, animation);
                    }
                } else {
                    if ( index < the.currentStepIndex ) {
                        $Util.addClass(element, 'completed');
                    } else {
                        $Util.addClass(element, 'pending');
                    }
                }
            }
        }
    }

    var _isLastStep = function() {
        return the.currentStepIndex === the.totalStepsNumber;
    }

    var _isFirstStep = function() {
        return the.currentStepIndex === 1;
    }

    var _isBetweenStep = function() {
        return _isLastStep() === false && _isFirstStep() === false;
    }

    var _getNextStepIndex = function() {
        if ( the.totalStepsNumber >= ( the.currentStepIndex + 1 ) ) {
            return the.currentStepIndex + 1;
        } else {
            return the.totalStepsNumber;
        }
    }

    var _getPreviousStepIndex = function() {
        if ( ( the.currentStepIndex - 1 ) > 1 ) {
            return the.currentStepIndex - 1;
        } else {
            return 1;
        }
    }

    var _getFirstStepIndex = function(){
        return 1;
    }

    var _getLastStepIndex = function() {
        return the.totalStepsNumber;
    }

    var _getTotalStepsNumber = function() {
        return the.totalStepsNumber;
    }

    var _getStepDirection = function(index) {
        if ( index > the.currentStepIndex ) {
            return 'next';
        } else {
            return 'previous';
        }
    }

    var _getStepContent = function(index) {
        var content = $Util.findAll(the.element, '[data-pdms-stepper-element="content"]');

        if ( content[index-1] ) {
            return content[index-1];
        } else {
            return false;
        }
    }

    var _destroy = function() {
        $Util.data(the.element).remove('stepper');
    }

    // Construct Class
    _construct();

    ///////////////////////
    // ** Public API  ** //
    ///////////////////////

    // Plugin API
    the.getElement = function(index) {
        return the.element;
    }

    the.goTo = function(index) {
        return _goTo(index);
    }

    the.goPrevious = function() {
        return _goPrevious();
    }

    the.goNext = function() {
        return _goNext();
    }

    the.goFirst = function() {
        return _goFirst();
    }

    the.goLast = function() {
        return _goLast();
    }

    the.getCurrentStepIndex = function() {
        return the.currentStepIndex;
    }

    the.getNextStepIndex = function() {
        return the.nextStepIndex;
    }

    the.getPassedStepIndex = function() {
        return the.passedStepIndex;
    }

    the.getClickedStepIndex = function() {
        return the.clickedStepIndex;
    }

    the.getPreviousStepIndex = function() {
        return the.PreviousStepIndex;
    }

    the.destroy = function() {
        return _destroy();
    }

    // Event API
    the.on = function(name, handler) {
        return $EventHandler.on(the.element, name, handler);
    }

    the.one = function(name, handler) {
        return $EventHandler.one(the.element, name, handler);
    }

    the.off = function(name) {
        return $EventHandler.off(the.element, name);
    }

    the.trigger = function(name, event) {
        return $EventHandler.trigger(the.element, name, event, the, event);
    }
};

// Static methods
$Stepper.getInstance = function(element) {
    if ( element !== null && $Util.data(element).has('stepper') ) {
        return $Util.data(element).get('stepper');
    } else {
        return null;
    }
}

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = $Stepper;
}
