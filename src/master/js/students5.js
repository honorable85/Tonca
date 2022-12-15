import('../../styles/paper.css');
import $App from '../../components/app';
import AutoComplete from '../../components/auto-complete';
import dayjs from 'dayjs';
import('dayjs/locale/fr');
import('../../components/drawer');
import bootbox from '../../../pdms_js/bootbox';
import('../../../pdms_js/modal.js');
import { pdms, PDMS } from '../../components/pdms';

var Cert = function() {

    var input, matricule, ref, is_countable, searchButton, printButton, detailsButton;
    var filterForm, filterButton;

    var initForm = () => {
        printButton.addEventListener('click', function(e) {
            e.preventDefault();

            if (is_countable) {
                $.ajax({
                    url: '../../pdms_public/',
                    type: 'post',
                    dataType: 'json',
                    data: { route: 'cert/print', ref: ref, mat: matricule },
                    context: printButton,
                    beforeSend: function() { this.disabled = true; },
                    complete: function() { this.disabled = false; },
                    success: function(r) {
                        if (r.success) {
                            document.body.classList.remove('A5');
                            window.print();
                            setTimeout(function() {
                                document.body.classList.add('A5');
                                is_countable = false;
                                input = null;
                                matricule = null;
                            }, 200);
                        }
                    },
                    error: err => console.log(err.responseText)
                });
            }
        })
    }

    const initNav = () => {
        const navPan = document.querySelector('.tabbed-pan');
        navPan.querySelector('[ data-nav-link="nav1"]').addEventListener('click', () => { pdms.ui.cfl('students') });
        navPan.querySelector('[ data-nav-link="nav2"]').addEventListener('click', () => { pdms.ui.cfl('students1') });
        navPan.querySelector('[ data-nav-link="nav3"]').addEventListener('click', () => { pdms.ui.cfl('students2') });
    }

    var fetchData = () => {
        $.ajax({
            url: '../../../pdms_public/',
            type: 'post',
            dataType: 'json',
            data: { route: 'FetchAllStudents' },
            success: r => {
                if (r.success) {
                    const auto = new AutoComplete(document.getElementById('student'), r.data.names, r.data.mats, function(inp, name, mat) {
                        inp.value = name;
                        input = inp;
                        matricule = mat;
                        searchButton.disabled = false;
                    });
                    auto.init();
                }
            },
            error: err => console.log(err.responseText)
        });
    }

    var fetchInfos = () => {

        if (!searchButton) return;

        searchButton.addEventListener('click', function(e) {
            e.preventDefault();

            $.ajax({
                url: '../../pdms_public/',
                type: 'post',
                dataType: 'json',
                data: { route: 'cert/data', mat: matricule },
                context: input,
                beforeSend: function() { this.disabled = true; },
                complete: function() { this.disabled = false; },
                success: function(r) {
                    if (r.success) {
                        document.getElementById('fullname').textContent = r.data.fullname;
                        document.getElementById('startdate').textContent = dayjs(r.data.date_ouverture).locale('fr').format('DD MMMM YYYY');
                        document.getElementById('enddate').textContent = dayjs().locale('fr').format('DD MMMM YYYY');
                        document.getElementById('startroom').textContent = r.data.first;
                        document.getElementById('endroom').textContent = r.data.last;
                        document.getElementById('idmat').textContent = matricule;
                        document.getElementById('signdate').textContent = dayjs().locale('fr').format('DD MMMM');
                        document.getElementById('signyear').textContent = dayjs().locale('fr').format('YY');
                        document.getElementById('idnum').textContent = r.data.ref;
                        this.value = '';
                        searchButton.disabled = true;
                        ref = r.data.num;
                        is_countable = true;
                    }
                },
                error: err => console.log(err.responseText)
            });
        })
        
    }

    var initFilter = () => {
        filterButton.addEventListener('click', function(e) {
            e.preventDefault();

            $.ajax({
                url: '../../pdms_public/',
                type: 'post',
                dataType: 'json',
                data: $(filterForm).serialize(),
                context: filterButton,
                beforeSend: function() { this.setAttribute('data-pdms-indicator', 'on'); this.disabled = true; },
                complete: function() { this.removeAttribute('data-pdms-indicator'); this.disabled = false; },
                success: function(r) {
                    if (r.success) {
                        $('#attest_accord').replaceWith(r.data);
                        $App.init();
                    } else {
                        $('#attest_accord').empty();
                    }
                },
                error: err => console.log(err.responseText)
            })
        })
    }

    return {
        init() {
            searchButton = document.querySelector('[data-action-button="search"]');
            printButton = document.querySelector('[data-action-button="print"]');
            detailsButton = document.querySelector('[data-action-button="details"]');
            filterButton = document.querySelector('[data-action-button="filter"]');
            filterForm = document.querySelector('[data-cert-form="filter"]');
            fetchData();
            fetchInfos();
            initForm();
            initFilter();
            initNav();
        }
    }
}();

$(function() {
    $App.init();
    Cert.init();
})