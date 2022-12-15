import('../../components/app');
import('../../components/menu');
import('jquery');
import { pdms } from '../../components/pdms';
import('datatables.net-dt');
import('../../init/datatables.init');

window.pdms = pdms;

const Educ = function() {

    let table;
    let dt;

    const initDatatable = () => {
        dt = $(table).DataTable({
            // responsive: true,
            order: [[1, 'asc']],
            bLengthChange: false,
            "language": {		
                "info": "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
                "infoEmpty": "Affichage de 0 à 0 sur 0 entrées",
                "infoFiltered": "(Filtrer depuis un total de _MAX_ entrées)",
                "thousands": " ",
                "emptyTable": "Aucune données disponible dans le tableau",
                "loadingRecords": "Chargement ...",
                "processing": "Traitement ...",
                "lengthMenu": "_MENU_",
                paginate: {
                    first: "Première",
                    last: "Dernière",
                    next: "Suivant",
                    previous: "Précédent"
                }
            },
            select: {
                style: 'os',
                selector: 'td:first-child',
                className: 'row-selected'
            }
        });
    }

    const initToggleToolbar = () => {
        // Toggle selected action toolbar
        // Select all checkboxes
        const checkboxes = table.querySelectorAll('[type="checkbox"]');

        // Select elements
        const downloadSingle = document.querySelectorAll('[data-report-action="download_single"]');

        // Toggle delete selected toolbar
        checkboxes.forEach(c => {
            // Checkbox on click event
            c.addEventListener('click', function () {
                setTimeout(function () {
                    toggleToolbars();
                }, 50);
            });
        });

        // Download single report
        document.querySelectorAll('[data-report-action="download_single"]').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                this.setAttribute('data-pdms-indicator', 'on');
                this.disabled = true;
                location.href = '../pdms_public/?route=educmaster/download&path='+this.getAttribute('data-file-path');
                
                const _this = this;
                setTimeout(function(){
                    _this.disabled = false;
                    _this.removeAttribute('data-pdms-indicator');
                }, 200);
            });
        });

        // Download row
        document.querySelectorAll('[data-report-action="download_all"]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                location.href = '../pdms_public/?route=educmaster/download-all&path='+this.getAttribute('data-file-path');
            });
        });

        document.querySelector('[data-table-toolbar="bulk_download"]').addEventListener('click', function(e) {
            e.preventDefault();

            const paths = [];

            table.querySelectorAll('tbody [type="checkbox"]:checked').forEach(c => {
                paths.push(c.getAttribute('data-reports-path'));
            });

            if (paths.length) {
                this.setAttribute('data-pdms-indicator', 'on');
                this.disabled = true;

                location.href = '../pdms_public/?route=educmaster/bulk-download&paths=' + encodeURIComponent(JSON.stringify(paths));

                const _this = this;
                setTimeout(function() {
                    _this.disabled = false;
                    _this.removeAttribute('data-pdms-indicator');
                }, 200);
            }
        });

        table.querySelector('thead [type="checkbox"]').addEventListener('click', function () {
            if (this.checked) {
                table.querySelectorAll('tbody [type="checkbox"]').forEach(c => {
                    c.checked = true
                })
            } else {
                table.querySelectorAll('tbody [type="checkbox"]').forEach(c => {
                    c.checked = false
                })
            }

            setTimeout(function () {
                toggleToolbars();
            }, 50);
        });
    }

    const toggleToolbars = () => {
        // Define variables
        const toolbarBase = document.querySelector('[data-table-toolbar="base"]');
        const toolbarSelected = document.querySelector('[data-table-toolbar="selected"]');
        const selectedCount = document.querySelector('[data-table-toolbar="selected_count"]');

        // Select refreshed checkbox DOM elements 
        const allCheckboxes = table.querySelectorAll('tbody [type="checkbox"]');

        // Detect checkboxes state & count
        let checkedState = false;
        let count = 0;

        // Count checked boxes
        allCheckboxes.forEach(c => {
            if (c.checked) {
                checkedState = true;
                count++;
            }
        });

        // Toggle toolbars
        if (checkedState) {
            selectedCount.innerHTML = count;
            toolbarBase.classList.add('d-none');
            toolbarSelected.classList.remove('d-none');
        } else {
            toolbarBase.classList.remove('d-none');
            toolbarSelected.classList.add('d-none');
        }

        if (allCheckboxes.length == count) {
            table.querySelector('thead [type="checkbox"]').checked = true;
        } else {
            table.querySelector('thead [type="checkbox"]').checked = false;
        }
    }

    const handleSearchDatatable = function () {
        const filterSearch = document.querySelector('[data-reports-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            dt.search(`${e.target.value}`).draw();
        });
    }

    return {
        init() {
            table = document.getElementById('educTable');

            initDatatable();
            initToggleToolbar();
            handleSearchDatatable();
        }
    }
}();

window.addEventListener('load', function() {
    Educ.init();
});

export default Educ;