"use strict";

import $Util from "./util";
import $EventHandler from "./event-handler";
import { CountUp } from "countup.js";
import { Tooltip, Toast } from "bootstrap";

// Class definition
var $App = function () {
    var initPageLoader = function () {
        // CSS3 Transitions only after page load(.page-loading class added to body tag and remove with JS on page load)
        $Util.removeClass(document.body, 'page-loading');
    }

    var initBootstrapTooltip = function (el, options) {
        var delay = {};

        // Handle delay options
        if (el.hasAttribute('data-bs-delay-hide')) {
            delay['hide'] = el.getAttribute('data-bs-delay-hide');
        }

        if (el.hasAttribute('data-bs-delay-show')) {
            delay['show'] = el.getAttribute('data-bs-delay-show');
        }

        if (delay) {
            options['delay'] = delay;
        }

        // Check dismiss options
        if (el.hasAttribute('data-bs-dismiss') && el.getAttribute('data-bs-dismiss') == 'click') {
            options['dismiss'] = 'click';
        }

        // Initialize popover
        var tp = new Tooltip(el, options);

        // Handle dismiss
        if (options['dismiss'] && options['dismiss'] === 'click') {
            // Hide popover on element click
            el.addEventListener("click", function (e) {
                tp.hide();
            });
        }

        return tp;
    }

    var initBootstrapTooltips = function (el, options) {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            initBootstrapTooltip(tooltipTriggerEl, {});
        });
    }

    var initBootstrapPopover = function (el, options) {
        var delay = {};

        // Handle delay options
        if (el.hasAttribute('data-bs-delay-hide')) {
            delay['hide'] = el.getAttribute('data-bs-delay-hide');
        }

        if (el.hasAttribute('data-bs-delay-show')) {
            delay['show'] = el.getAttribute('data-bs-delay-show');
        }

        if (delay) {
            options['delay'] = delay;
        }

        // Handle dismiss option
        if (el.getAttribute('data-bs-dismiss') == 'true') {
            options['dismiss'] = true;
        }

        if (options['dismiss'] === true) {
            options['template'] = '<div class="popover" role="tooltip"><div class="popover-arrow"></div><span class="popover-dismiss btn btn-icon"><i class="bi bi-x fs-2"></i></span><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        }

        // Initialize popover
        var popover = new bootstrap.Popover(el, options);

        // Handle dismiss click
        if (options['dismiss'] === true) {
            var dismissHandler = function (e) {
                popover.hide();
            }

            el.addEventListener('shown.bs.popover', function () {
                var dismissEl = document.getElementById(el.getAttribute('aria-describedby'));
                dismissEl.addEventListener('click', dismissHandler);
            });

            el.addEventListener('hide.bs.popover', function () {
                var dismissEl = document.getElementById(el.getAttribute('aria-describedby'));
                dismissEl.removeEventListener('click', dismissHandler);
            });
        }

        return popover;
    }

    var initBootstrapPopovers = function () {
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));

        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            initBootstrapPopover(popoverTriggerEl, {});
        });
    }

    var initScrollSpy = function () {
        var elements = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'));

        elements.map(function (element) {
            var sel = element.getAttribute('data-bs-target');
            var scrollContent = document.querySelector(element.getAttribute('data-bs-target'));
            var scrollSpy = bootstrap.ScrollSpy.getInstance(scrollContent);
            if (scrollSpy) {
                scrollSpy.refresh();
            }
        });
    }

    var initButtons = function () {
        var buttonsGroup = [].slice.call(document.querySelectorAll('[data-pdms-buttons="true"]'));

        buttonsGroup.map(function (group) {
            var selector = group.hasAttribute('data-pdms-buttons-target') ? group.getAttribute('data-pdms-buttons-target') : '.btn';

            // Toggle Handler
            $Util.on(group, selector, 'click', function (e) {
                var buttons = [].slice.call(group.querySelectorAll(selector + '.active'));

                buttons.map(function (button) {
                    button.classList.remove('active');
                });

                this.classList.add('active');
            });
        });
    }

    var initCheck = function () {
        // Toggle Handler
        $Util.on(document.body, '[data-pdms-check="true"]', 'change', function (e) {
            var check = this;
            var targets = document.querySelectorAll(check.getAttribute('data-pdms-check-target'));

            $Util.each(targets, function (target) {
                if (target.type == 'checkbox') {
                    target.checked = check.checked;
                } else {
                    target.classList.toggle('active');
                }
            });
        });
    }

    var initSelect2 = function () {
        var elements = [].slice.call(document.querySelectorAll('[data-control="select2"], [data-pdms-select2="true"]'));

        elements.map(function (element) {
            var options = {
                dir: document.body.getAttribute('direction')
            };

            if (element.getAttribute('data-hide-search') == 'true') {
                options.minimumResultsForSearch = Infinity;
            }

            $(element).select2(options);
        });
    }

    var initAutosize = function () {
        var inputs = [].slice.call(document.querySelectorAll('[data-pdms-autosize="true"]'));

        inputs.map(function (input) {
            autosize(input);
        });
    }

    var initCountUp = function () {
        var elements = [].slice.call(document.querySelectorAll('[data-pdms-countup="true"]:not(.counted)'));

        elements.map(function (element) {
            if ($Util.isInViewport(element) && $Util.visible(element)) {
                var options = {};

                var value = element.getAttribute('data-pdms-countup-value');
                value = parseFloat(value.replace(/,/g, ""));

                if (element.hasAttribute('data-pdms-countup-start-val')) {
                    options.startVal = parseFloat(element.getAttribute('data-pdms-countup-start-val'));
                }

                if (element.hasAttribute('data-pdms-countup-duration')) {
                    options.duration = parseInt(element.getAttribute('data-pdms-countup-duration'));
                }

                if (element.hasAttribute('data-pdms-countup-decimal-places')) {
                    options.decimalPlaces = parseInt(element.getAttribute('data-pdms-countup-decimal-places'));
                }

                if (element.hasAttribute('data-pdms-countup-prefix')) {
                    options.prefix = element.getAttribute('data-pdms-countup-prefix');
                }

                if (element.hasAttribute('data-pdms-countup-suffix')) {
                    options.suffix = element.getAttribute('data-pdms-countup-suffix');
                }

                var count = new CountUp(element, value, options);

                count.start();

                element.classList.add('counted');
            }
        });
    }

    var initCountUpTabs = function () {
        // Initial call
        initCountUp();

        // Window scroll event handler
        window.addEventListener('scroll', initCountUp);

        // Tabs shown event handler
        var tabs = [].slice.call(document.querySelectorAll('[data-pdms-countup-tabs="true"][data-bs-toggle="tab"]'));
        tabs.map(function (tab) {
            tab.addEventListener('shown.bs.tab', initCountUp);
        });
    }

    var initTinySliders = function () {
        // Init Slider
        var initSlider = function (el) {
            if (!el) {
                return;
            }

            const tnsOptions = {};

            // Convert string boolean
            const checkBool = function (val) {
                if (val === 'true') {
                    return true;
                }
                if (val === 'false') {
                    return false;
                }
                return val;
            };

            // get extra options via data attributes
            el.getAttributeNames().forEach(function (attrName) {
                // more options; https://github.com/ganlanyuan/tiny-slider#options
                if ((/^data-tns-.*/g).test(attrName)) {
                    let optionName = attrName.replace('data-tns-', '').toLowerCase().replace(/(?:[\s-])\w/g, function (match) {
                        return match.replace('-', '').toUpperCase();
                    });

                    if (attrName === 'data-tns-responsive') {
                        // fix string with a valid json
                        const jsonStr = el.getAttribute(attrName).replace(/(\w+:)|(\w+ :)/g, function (matched) {
                            return '"' + matched.substring(0, matched.length - 1) + '":';
                        });
                        try {
                            // convert json string to object
                            tnsOptions[optionName] = JSON.parse(jsonStr);
                        }
                        catch (e) {
                        }
                    }
                    else {
                        tnsOptions[optionName] = checkBool(el.getAttribute(attrName));
                    }
                }
            });

            const opt = Object.assign({}, {
                container: el,
                slideBy: 'page',
                autoplay: true,
                autoplayButtonOutput: false,
            }, tnsOptions);

            if (el.closest('.tns')) {
                $Util.addClass(el.closest('.tns'), 'tns-initiazlied');
            }

            return tns(opt);
        }

        // Sliders
        const elements = Array.prototype.slice.call(document.querySelectorAll('[data-tns="true"]'), 0);

        if (!elements && elements.length === 0) {
            return;
        }

        elements.forEach(function (el) {
            initSlider(el);
        });
    }

    var initSmoothScroll = function () {
        if (SmoothScroll) {

            new SmoothScroll('a[data-pdms-scroll-toggle][href*="#"]', {
                speed: 900,
                offset: function (anchor, toggle) {
                    // Integer or Function returning an integer. How far to offset the scrolling anchor location in pixels
                    // This example is a function, but you could do something as simple as `offset: 25`

                    // An example returning different values based on whether the clicked link was in the header nav or not
                    if (anchor.hasAttribute('data-pdms-scroll-offset')) {
                        var val = $Util.getResponsiveValue(anchor.getAttribute('data-pdms-scroll-offset'));

                        return val;
                    } else {
                        return 0;
                    }
                }
            });
        }
    }

    var initBootstrapToast = () => {
        var toastElList = [].slice.call(document.querySelectorAll('.toast'));
        var toastList = toastElList.map(function (toastEl) {
            return new Toast(toastEl, {
                delay: 500
            })
        });
    }

    return {
        init: function () {
            this.initPageLoader();

            this.initBootstrapTooltips();

            this.initBootstrapPopovers();

            // this.initScrollSpy();

            // this.initButtons();

            // this.initCheck();

            this.initSelect2();

            this.initCountUp();

            this.initCountUpTabs();

            // this.initAutosize();

            // this.initTinySliders();

            // this.initSmoothScroll();

            this.initBootstrapToast();
        },

        initPageLoader: function () {
            initPageLoader();
        },

        initBootstrapTooltip: function (el, options) {
            return initBootstrapTooltip(el, options);
        },

        initBootstrapTooltips: function () {
            initBootstrapTooltips();
        },

        initBootstrapPopovers: function () {
            initBootstrapPopovers();
        },

        initBootstrapPopover: function (el, options) {
            return initBootstrapPopover(el, options);
        },

        initScrollSpy: function () {
            initScrollSpy();
        },

        initButtons: function () {
            initButtons();
        },

        initCheck: function () {
            initCheck();
        },

        initSelect2: function () {
            initSelect2();
        },

        initCountUp: function () {
            initCountUp();
        },

        initCountUpTabs: function () {
            initCountUpTabs();
        },

        initAutosize: function () {
            initAutosize();
        },

        initTinySliders: function () {
            initTinySliders();
        },

        initSmoothScroll: function () {
            initSmoothScroll();
        },

        initBootstrapToast: function () {
            initBootstrapToast();
        },

        isDarkMode: function () {
            return document.body.classList.contains('dark-mode');
        }
    };
}();

// On document ready
$Util.onDOMContentLoaded(function () {
    $App.init();
});

// On window load
window.addEventListener("load", function () {
    $App.initPageLoader();
    // $App.init();
});

// Webpack support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = $App;
}

export default $App;