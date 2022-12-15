import('../../../pdms_teacher/css/style.css');
import('../../styles/paper.css');
import('jquery');
// import bootbox from '../../../pdms_js/bootbox';
// import('../../../pdms_js/modal.js');
import { pdms, PDMS } from '../../components/pdms';

const Threshold = function($) {

    let form;

    const initForm = () => {
        form.querySelector('select[name="spec"]').addEventListener('change', function(e) {
            e.preventDefault();

            form.querySelector('input[name="route"]').value = 'threshold/rooms';

            $.ajax({
                url: '../pdms_public/',
                type: 'post',
                dataType: 'html',
                data: $(form).serialize(),
                context: this,
                beforeSend: function() { this.disabled = true; },
                complete: function() { this.disabled = false; },
                success: html => {
                    form.querySelector('select[name="room"]').innerHTML = html;
                },
                error: err => console.log(err.responseText)
            });
        });

        form.querySelector('select[name="room"]').addEventListener('change', function(e) {
            e.preventDefault();

            form.querySelector('input[name="route"]').value = 'threshold/subjects';

            $.ajax({
                url: '../pdms_public/',
                type: 'post',
                dataType: 'html',
                data: $(form).serialize(),
                context: this,
                beforeSend: function() { this.disabled = true; },
                complete: function() { this.disabled = false; },
                success: html => {
                    document.getElementById('rlt').innerHTML = html;
                    initUpdate();
                },
                error: err => console.log(err.responseText)
            });
        });
    }

    const initUpdate = () => {
        [].slice.call(document.getElementById('rlt').querySelectorAll('.badge')).forEach(b => {
            b.addEventListener('click', function(e) {
                e.preventDefault();

                prompt('Nouveau Seuil', false, v => {
                    if (v) {

                        form.querySelector('input[name="route"]').value = 'threshold/update';

                        $.ajax({
                            url: '../pdms_public/',
                            type: 'post',
                            dataType: 'json',
                            data: $(form).serialize()+'&subject='+this.getAttribute('data-subject-id')+'&value='+v,
                            context: this,
                            success: function(r) {
                                const cls = parseInt(v) <= 50 ? 'badge-info': (parseInt(v) <= 60 ? 'badge-warning': 'badge-danger');
                                this.textContent = v+'%';
                                this.classList.remove('badge-info');
                                this.classList.remove('badge-warning');
                                this.classList.remove('badge-danger');
                                this.classList.add(cls);
                            },
                            error: err => console.log(err.responseText)
                        });
                    }
                })
            });
        })
    }

    return {
        init() {
            form = document.getElementById('frm');

            if (!form) return;

            initForm();
        }
    }
}(jQuery);

window.addEventListener('load', () => {
    Threshold.init();
    window.pdms = pdms;
});

export default Threshold;