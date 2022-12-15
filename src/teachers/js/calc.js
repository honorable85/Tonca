import('../../../pdms_teacher/css/style.css');
import('../../styles/paper.css');
import('jquery');
import bootbox from '../../../pdms_js/bootbox';
import('../../../pdms_js/modal.js');
import { pdms, PDMS } from '../../components/pdms';

var Calc = function() {

    var element;
    var form;
    var submitButton;
    var table;
    var dt;
    var block;

    var initForm = () => {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            $.ajax({
                url: '../../pdms_public/',
                type: 'post',
                dataType: 'json',
                data: $(form).serialize(),
                context: submitButton,
                beforeSend: function() { this.setAttribute('data-pdms-indicator', 'on'); this.disabled = true },
                complete: function() { this.removeAttribute('data-pdms-indicator'); this.disabled = false },
                success: function(r) {
                    element.innerHTML = r.data;
                    $('.pf-textbox').each(function(index, element) {
                        new PDMS().Prettyform.Textbox(element);
                    });
                    $(window.frameElement).trigger('load');
                    init();
                },
                error: err => console.log(err.responseText)
            })
        })
    }

    const initNav = () => {
        const navPan = document.querySelector('.list.tab');
        navPan.querySelector('[ data-nav-link="nav1"]').addEventListener('click', () => { pdms.ui.cfl('time') });
        navPan.querySelector('[ data-nav-link="nav2"]').addEventListener('click', () => { pdms.ui.cfl('mark') });
        navPan.querySelector('[ data-nav-link="nav3"]').addEventListener('click', () => { pdms.ui.cfl('calc') });
        navPan.querySelector('[ data-nav-link="nav4"]').addEventListener('click', () => { pdms.ui.cfl('exam') });
        navPan.querySelector('[ data-nav-link="nav5"]').addEventListener('click', () => { pdms.ui.cfl('guide') });
        navPan.querySelector('[ data-nav-link="nav6"]').addEventListener('click', () => { pdms.ui.cfl('absence') });
        navPan.querySelector('[ data-nav-link="nav61"]').addEventListener('click', () => { pdms.ui.cfl('absence2') });
        navPan.querySelector('[ data-nav-link="nav7"]').addEventListener('click', () => { pdms.ui.cfl('help') });
    }

    var init = () => {
        element = document.getElementById('wrap');
        form = document.getElementById('mark_frm');

        if (!form) return;

        submitButton = form.querySelector('[type="submit"]');
        
        initForm();
        // initNav();
    }

    return {
		init
	};
}();

$(function() {
    window.pdms = pdms;
    Calc.init();
})