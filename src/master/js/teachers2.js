// JavaScript Document
import('jquery');
import bootbox from '../../../pdms_js/bootbox';
import {sortable} from '../../../pdms_js/jqueryui';
import('../../../pdms_js/nested.js');
import('../../../pdms_js/modal.js');
import { pdms, PDMS } from '../../components/pdms';

const Teacher = function($) {

    let cli;
    let topicEl;
    let promoEl;
    let roomEl;
    let modEl;
    let loadTBtn;
    let loadCBtn;
    let printBtn;
    let saveBtn;
    let tForm;
    let cForm;
    let tsubjEl;
    let troomEl;
    let navPan;

    const initPage = () => {
        topicEl.addEventListener('change', function(e) {
            e.preventDefault();

            $.ajax({
                url: '../pdms_public/',
                type: 'POST',
                dataType: 'html',
                data: { route: 'subjects/module', name: this.value },
                context: $(e.target),
                beforeSend: function() { this.disabled = true },
                complete: function() { this.disabled = false },
                success: function(r) {
                    
                    $('select[name=module]').html(r);
                }
            });
        });

        tForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const $this = $(this);

            $.ajax({
                url: '../pdms_public/',
                type: 'POST',
                dataType: 'html',
                data: $(this).serialize(),
                context: loadTBtn,
                beforeSend: function() { this.disabled = true },
                complete: function() { this.disabled = false },
                success: function(r) {
                    const content = $(r);
                    $('#teachers_list').html(content);
                    tsubjEl.value = $this.find('select[name=subject]').val();
                    if ($('#classroom .sit').length) sortable();
    
                    if (content.find('.notice.warning').length == 0) {
                        document.getElementById('ldt_02').disabled = false;
                    }
                }
            });
        });

        cForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const $this = $(this);

            $.ajax({
                url: '../pdms_public/',
                type: 'POST',
                dataType: 'json',
                data: $(this).serialize(),
                context: loadCBtn,
                beforeSend: function() { this.disabled = true },
                complete: function() { this.disabled = false },
                success: function(r) {
                    
                    if (r.success) {
                        document.getElementById('ldt_03').disabled = false;
                        $('#classroom').html(r.data);
                        troomEl.value = $this.find('select[name=classe]').val();
                        if ($('#teachers_list img').length) sortable();
                        $('.tooltip').each(function(index, element) {
                            new PDMS().Tooltip(this, 'info');
                        });
                        addSit();
                    } else pdms.ui.notify(r.data, 'error');
                }
            });
        });

        promoEl.addEventListener('change', function(e) {
            e.preventDefault();

            pdms.master.room.fdt(e, 6, html => {
                roomEl.innerHTML = '<option value="">Classe</option>'+html
            });
        });

        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const matricules = [].slice.call(document.querySelectorAll('.teacher-sit .tooltip i')).map(n => n.textContent);
            
            $.ajax({
                url: '../pdms_public/',
                type: 'POST',
                dataType: 'json',
                data: { route: 'rooms/save-teacher-room', matricules, tsubject: tsubjEl.value, troom: troomEl.value },
                context: this,
                beforeSend: function() { this.disabled = true },
                complete: function() { this.disabled = false },
                success: function(r) {
                    if (r.success) pdms.ui.notify(r.data, 'success');
                    else pdms.ui.notify(r.data, 'error');
                },
                error: err => console.log(err.responseText)
            });
        });
    }

    const initNav = () => {
        navPan.querySelector('[ data-nav-link="nav1"]').addEventListener('click', () => { pdms.ui.cfl('teachers') });
        navPan.querySelector('[ data-nav-link="nav2"]').addEventListener('click', () => { pdms.ui.cfl('teachers1') });
        navPan.querySelector('[ data-nav-link="nav3"]').addEventListener('click', () => { pdms.ui.cfl('teachers3') });
        navPan.querySelector('[ data-nav-link="nav4"]').addEventListener('click', () => { pdms.ui.cfl('teachers6') });
        navPan.querySelector('[ data-nav-link="nav5"]').addEventListener('click', () => { pdms.ui.cfl('teachers7') });
        navPan.querySelector('[ data-nav-link="nav6"]').addEventListener('click', () => { pdms.ui.cfl('teachers8') });
        navPan.querySelector('[ data-nav-link="nav7"]').addEventListener('click', () => { pdms.ui.cfl('teachers5') });
    }

    const sortable = () => { 
			
        const opts1 = {
            listType: 'ul',
            handler: 'div',
            items: 'li',
            toleranceElement: '> div',
            tabSize: 20,
            maxLevels: 1,
            connectWith: '#teachers_list',
            isAllowed: isDropAllowed
        }
        const opts2 = {
            listType: 'ul',
            handler: 'div',
            items: 'li',
            toleranceElement: '> div',
            tabSize: 20,
            maxLevels: 1,
            connectWith: '.teacher-sit > ul > li > ul',
            isAllowed: isDropAllowed
        }
        $('#teachers_list').nestedSortable(opts2);
        $('.teacher-sit > ul > li > ul').nestedSortable(opts1);
    }

    const isDropAllowed = (itm, p) => { 
			
        if (!itm.parent().is('#teachers_list') && itm.parent().children().length > 1) {
            
            if (p)
            bootbox.dialog({
                message: '<b>Désolé ! Vous ne pouvez pas disposer deux enseignants d\'une même matière sur une même table ! Veuillez créer une table suplémentaire.',
                title: '<i class="fa fa-warning"></i> Mauvaise disposition',
                size: 'small',
                closeButton: false,
                backdrop: false,
                buttons: {
                    ok: {label: 'Ok', className: 'pf-btn pf-btn-primary'}
                }
            });
            
            return false;
        }
        
        return true;
    }

    const addSit = () => {
        const cont = $('.teacher');
		const addBtn = $(`
            <button class="btn btn-icon" data-title="Ajouter une table">
                <i class="bi bi-plus-circle fs-2"></i>
            </button>
        `);
        addBtn.appendTo(cont);
        new PDMS().Tooltip(addBtn.get(0), 'info');

        // Append one sit
        const sit = $(`
            <section class="teacher-sit ms-5">
                <ul class="list left">
                    <li>
                        <ul class="list ui-sortable"></ul>
                    </li>
                </ul>
                <div class="text-center">
                    <button class="btn btn-icon btn-icon-light" data-title="Supprimer la table">
                        <i class="bi bi-dash-circle-fill fs-2"></i>
                    </button>
                </div>
            </section>
        `);
        const remBtn = sit.find('.btn-icon');
        new PDMS().Tooltip(remBtn.get(0), 'info');

        addBtn.on('click', function(e) {
            e.preventDefault();
            sit.removeClass('d-none');
            cont.append(sit);
            $(this).addClass('d-none');
            sortable();
        });

        remBtn.on('click', function(e) {
            e.preventDefault();
            sit.addClass('d-none');
            sit.find('.ui-sortable').empty();
            addBtn.removeClass('d-none');
        })
    }

    return {
        init() {
            topicEl = document.querySelector('[data-action-select="topic"]');
            modEl = document.querySelector('[data-action-select="module"]');
            loadTBtn = document.querySelector('[data-action-button="load-teachers"]');
            printBtn = document.querySelector('[data-action-button="print"]');
            tForm = document.querySelector('[data-form-element="load-teacher"]');
            cForm = document.querySelector('[data-form-element="load-room"]');
            loadCBtn = cForm.querySelector('button');
            promoEl = cForm.querySelector('select[name="promo"]');
            roomEl = cForm.querySelector('select[name="classe"]');
            tsubjEl = cForm.querySelector('input[name="tsubject"]');
            troomEl = cForm.querySelector('input[name="troom"]');
            navPan = document.querySelector('.tabbed-pan');
            saveBtn = document.getElementById('ldt_03');
            
            initPage();
            initNav();
        }
    }
}(jQuery);

window.addEventListener('load', () => {
    Teacher.init();
})

export default Teacher;