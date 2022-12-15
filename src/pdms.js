"use strict";

import jQuery from 'jquery';
import AOS from 'aos';
import CAUtil from './components/util';
import CAScrolltop from './components/scrolltop';
import { formValidation } from './formvalidation/dist/es6';
import Trigger from './formvalidation/Trigger';
import Bootstrap5 from './formvalidation/Bootstrap5';
import Recaptcha from './formvalidation/Recaptcha';
import Fslightbox from 'fslightbox';
import CADrawer from './components/drawer';
import ath from './add-to-homescreen-master/src/addtohomescreen'
import videojs from 'video.js';

const pdms = (function($) { 

    let demo;
    let demoForm;
    let demoModal;
    let demoSubmitButton;
    let demoValidator;
    
    let priceForm;
    let priceSubmitButton;
    let priceValidator;

    let contactForm;
    let contactSubmitButton;
    let contactValidator;
    let contactModal;

    let initDemoForm = () => {
        demoSubmitButton.addEventListener('click', e => {
            e.preventDefault();

            if ( demoValidator ) {
                demoValidator.validate().then(result => {
                    if (result == 'Valid') {
                        handleDemo();
                    }
                })
            }
        })
    }

    let initPriceForm = () => {
        priceSubmitButton.addEventListener('click', e => {
            e.preventDefault();

            if ( priceValidator ) {
                priceValidator.validate().then(result => {
                    if (result == 'Valid') {
                        handlePrice();
                    }
                })
            }
        })
    }

    let initContactForm = () => {
        contactSubmitButton.addEventListener('click', e => {
            e.preventDefault();

            if ( contactValidator ) {
                contactValidator.validate().then(result => {
                    if (result == 'Valid') {
                        handleContact();
                    }
                })
            }
        })
    }

    let initDemoValidation = () => {
        demoValidator = formValidation(demoForm, {
            fields: {
                phone: {
                    validators: {
                        notEmpty: {
                            message: 'Numéro de téléphone'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Votre adresse email'
                        },
                        emailAddress: {
                            message: 'Adresse email non valide'
                        }
                    }
                },
                fullname: {
                    validators: {
                        notEmpty: {
                            message: 'Votre nom complet'
                        }
                    }
                },
                country: {
                    validators: {
                        notEmpty: {
                            message: 'Pays et ville'
                        }
                    }
                },
                school: {
                    validators: {
                        notEmpty: {
                            message: "Nom de l'établissement"
                        }
                    }
                },
                effectif: {
                    validators: {
                        notEmpty: {
                            message: "Effectif de l'établissement"
                        }
                    }
                },
            },
            plugins: {
                trigger: new Trigger(),
                bootstrap: new Bootstrap5({
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                }),
                recaptcha: new Recaptcha({
                    element: 'pdms_demo_recaptcha',
                    language: 'fr',
                    message: 'Captcha non valid',
                    siteKey: '6LcESBQfAAAAAJvJTmV5Q3vJz7J0bZN4sxBxo5ZI',
                    theme: 'light'
                })
            }
        });
    }

    let initPriceValidation = () => {
        priceValidator = formValidation(priceForm, {
            fields: {
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Votre adresse email'
                        },
                        emailAddress: {
                            message: 'Adresse email non valide'
                        }
                    }
                },
                fullname: {
                    validators: {
                        notEmpty: {
                            message: 'Votre nom complet'
                        }
                    }
                },
                country: {
                    validators: {
                        notEmpty: {
                            message: 'Pays et ville'
                        }
                    }
                },
                school: {
                    validators: {
                        notEmpty: {
                            message: "Nom de l'établissement"
                        }
                    }
                },
                effectif: {
                    validators: {
                        notEmpty: {
                            message: "Effectif de l'établissement"
                        }
                    }
                },
            },
            plugins: {
                trigger: new Trigger(),
                bootstrap: new Bootstrap5({
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                }),
                recaptcha: new Recaptcha({
                    element: 'pdms_price_recaptcha',
                    language: 'fr',
                    message: 'Captcha non valid',
                    siteKey: '6LcESBQfAAAAAJvJTmV5Q3vJz7J0bZN4sxBxo5ZI',
                    theme: 'light'
                })
            }
        });
    }

    let initContactValidation = () => {
        contactValidator = formValidation(contactForm, {
            fields: {
                email: {
                    validators: {
                        notEmpty: {
                            message: 'Votre adresse email'
                        },
                        emailAddress: {
                            message: 'Adresse email non valide'
                        }
                    }
                },
                phone: {
                    validators: {
                        notEmpty: {
                            message: 'Numéro de téléphone'
                        }
                    }
                },
                fullname: {
                    validators: {
                        notEmpty: {
                            message: 'Votre nom complet'
                        }
                    }
                },
                country: {
                    validators: {
                        notEmpty: {
                            message: 'Pays et ville'
                        }
                    }
                },
                school: {
                    validators: {
                        notEmpty: {
                            message: "Nom de l'établissement"
                        }
                    }
                },
                subject: {
                    validators: {
                        notEmpty: {
                            message: "Objet du message"
                        }
                    }
                },
                message: {
                    validators: {
                        notEmpty: {
                            message: "Votre message"
                        }
                    }
                }
            },
            plugins: {
                trigger: new Trigger(),
                bootstrap: new Bootstrap5({
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                }),
                recaptcha: new Recaptcha({
                    element: 'pdms_contact_recaptcha',
                    language: 'fr',
                    message: 'Captcha non valid',
                    siteKey: '6LcESBQfAAAAAJvJTmV5Q3vJz7J0bZN4sxBxo5ZI',
                    theme: 'light'
                })
            }
        });
    }

    let handleDemo = () => {
        $.ajax({
            url: './pdms_public/',
            type: 'post',
            dataType: 'json',
            data: $(demoForm).serialize(),
            context: demoSubmitButton,
            beforeSend: function() { this.setAttribute('data-pdms-indicator', 'on'); this.disabled = true },
            complete: function() { this.removeAttribute('data-pdms-indicator'); this.disabled = false },
            success: r => {
                if ( r.message ) {
                    $(demo).find('.modal-footer').remove();
                    $(demo).find('.modal-body').html(r.message);
                }
            },
            error: err => { console.log(err.responseText); }
        })
    }

    let handlePrice = () => {
        $.ajax({
            url: './pdms_public/',
            type: 'post',
            dataType: 'json',
            data: $(priceForm).serialize(),
            context: priceSubmitButton,
            beforeSend: function() { this.setAttribute('data-pdms-indicator', 'on'); this.disabled = true },
            complete: function() { this.removeAttribute('data-pdms-indicator'); this.disabled = false },
            success: r => {
                if ( r.success ) {
                    const lightbox = new FsLightbox();
                    lightbox.props.sources = r.data;
                    lightbox.props.onInit = () => console.log('Lightbox initialized !');
                    lightbox.open();
                    priceForm.reset();
                } else {
                    alert('Veuillez renseigner les informaions requises');
                }
            },
            error: err => { console.log(err.responseText); }
        })
    }

    let handleContact = () => {
        $.ajax({
            url: './pdms_public/',
            type: 'post',
            dataType: 'json',
            data: $(contactForm).serialize(),
            context: contactSubmitButton,
            beforeSend: function() { this.setAttribute('data-pdms-indicator', 'on'); this.disabled = true },
            complete: function() { this.removeAttribute('data-pdms-indicator'); this.disabled = false },
            success: r => {
                if ( r.success ) {
                    contactModal.show();
                    contactForm.reset();
                } else {
                    alert('Veuillez renseigner les informaions requises');
                }
            },
            error: err => { console.log(err.responseText); }
        })
    }

    let initPresentation = () => {
        document.querySelectorAll('.present').forEach(elt => {
            elt.addEventListener('click', e => {
                e.preventDefault();
                
                const fn = 'Video_' + elt.href.split('#')[1].substr(4) + '.mp4';

                $.ajax({
                    url: '/pdms_public/',
                    type: 'post',
                    dataType: 'json',
                    data: { route: 'Present', fn },
                    success: r => {console.log(r)
                        if ( r.success ) {
                            const lightbox = new FsLightbox();
                            lightbox.props.sources = r.data;
                            lightbox.props.onInit = () => console.log('Lightbox initialized !');
                            lightbox.open();
                            priceForm.reset();
                        }
                    },
                    error: err => { console.log(err.responseText) }
                })
            })
        })
    }

    return {
        init() {
            demo = document.getElementById('pdms_demo_frm');
            demoForm = demo.querySelector('form');
            demoSubmitButton = demoForm.querySelector('[type="submit"]');

            priceForm = document.getElementById('pdms_price_frm');
            priceSubmitButton = priceForm.querySelector('[type="submit"]');

            contactForm = document.getElementById('pdms_contact_frm');
            contactSubmitButton = contactForm.querySelector('[type="submit"]');
           
            AOS.init();
            initDemoForm();
            initPriceForm();
            initContactForm();
            initDemoValidation();
            initPriceValidation();
            initContactValidation();

            initPresentation();
            
            document.querySelectorAll('[data-pdms-scrollto="true"]').forEach(element => {
                if (element.getAttribute('data-scroll-target')) {
                    element.addEventListener('click', function(e) {
                        e.preventDefault();

                        var target;
                        
                        if ( element.nodeName === 'A' ) {
                            target = document.getElementById(element.href.split('#')[1]);
                        }

                        if ( target == null ) {
                            target = document.querySelector(element.getAttribute('data-scroll-target'));
                        }
                        
                        if (target) {
                            CAUtil.scrollTo(target, 200, 1000);
                        }
                    })
                }
            });
        },
        initBootstrap() {
            import('bootstrap').then(bootstrap => {
                // jQuery('#cabc_01').swipe({
                //     swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                //         if (direction == 'left') jQuery(this).carousel('next');
                //         if (direction == 'right') jQuery(this).carousel('prev');
                //     },
                //     allowPageScroll: "vertical" 
                // });
                
                [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(elt => {
                    new bootstrap.Tooltip(elt);
                });

                demoModal = new bootstrap.Modal(demo);
                contactModal = new bootstrap.Modal(document.getElementById('pdms_contact_modal'))
            });
        }
    }; 
})(jQuery);

export default pdms;