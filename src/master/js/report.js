// JavaScript Document
import('../sass/report.scss');
import { pdms, PDMS } from '../../components/pdms';
import AutoComplete from '../../components/auto-complete';
import Tooltip from '../../components/tooltip';
import ddm from '../../components/ddm';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';

window.pdms = pdms; 
window.PDMS = PDMS;

const Report = function($) {

    let activateButton;
    let deleteButton;

    const initReport = () => {
        $.ajax({
            url: '../pdms_public/',
            type: 'post',
            dataType: 'json',
            data: { route: 'report/index' },
            success: function(r) {
                if (r.success) {
                    const auto = new AutoComplete(document.getElementById('trouve'), r.data.arr1, r.data.arr2, function(elt, v1, v2) {
                    
                        elt.value = v1;
                        
                        $.ajax({
                            url:"../pdms_public/",
                            type:"post",
                            dataType:"html",
                            data: { route: 'report/search', matricule: v2 },
                            success: function(r) { 
                                $("#recent_reports").replaceWith('<div id="recent_reports" class="position-relative">'+r+"</div>");
                                $("section > h2:first").text("Résultat recherche");
                                slide();
                            }
                        });
                    });
                    auto.max_results = 5;
                    auto.init();
                }
            },
            error: err => console.log(err.responseText)
        });
        
        slide();
        ddm(document.getElementById('ddm'));
        $(window.frameElement).trigger('load');

        activateButton.addEventListener('click', function(e) {
            e.preventDefault();

            $.ajax({
                url:"../pdms_public/",
                type:"post",
                dataType:"json",
                data:{ route: 'report/activate', model: this.parentNode.element.dataset.name },
                context: $(this.parentNode.element).parents("div.item"),
                success: function(r) { 
                    if(r.success) {
                        location.reload();
                    }
                },
                error: err => console.log(err.responseText)
            });
        });

        deleteButton.addEventListener('click', function(e) {
            e.preventDefault();

			confirm("Voulez-vous désinstaller le model ? l'opération est irréversible.", false, function(e) {
				if (e.target.textContent === 'Oui') {
                    $.ajax({
                        url: "../pdms_public/",
                        type: "post",
                        dataType: "json",
                        data: { route: 'report/delete', model: t.target.parentNode.element.dataset.name },
                        context: $(t.target.parentNode.element).parents("div.item"),
                        success: function(r) { 
                            if (r.success) this.remove();
                        },
                        error: err => console.log(err.responseText)
                    }) 
                }
			});
        })
    }

    const slide = () => {
        $('.owl-carousel').each(function() {

            const $this = $(this);

            $(this).owlCarousel({
                margin: 30,
                nav: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: true
                    },
                    640: {
                        items: 2,
                        nav: true
                    },
                    1040: {
                        items: 3,
                        nav: true
                    }
                }
            }).find('.item').each(function() {
                new Tooltip(this, 'info');
            });
            
            $this.parent().find('.slide-nav.left-arrow').on('click', e => {
                $this.find('.owl-nav .owl-prev').trigger('click');
            });

            $this.parent().find('.slide-nav.right-arrow').on('click', e => {
                $this.find('.owl-nav .owl-next').trigger('click');
            });
        })
    }

    const request = () => {}

    return {
        init() {
            activateButton = document.querySelector('[data-context-menu="activate"]');
            deleteButton = document.querySelector('[data-context-menu="delete"]');

            initReport();
        }
    }
}(jQuery);

// pdms.master.report = (function($) {
	
// 	return {
		
// 		init: function() { 
			
			
// 		},
//         slide() {
            
//         },
// 		req: function(e,t,n) {
			
// 			t=t.split("#");
// 			e.className="result-box";
// 			$(e).html("<strong>"+n+"</strong>"+t[0].substr(n.length)+'<input type="hidden" name="matricule" value="'+t[1]+'"/><input type="hidden" name="name" value="'+t[0]+'"/>');
// 		},
// 		cb: function(e) {
			
// 			$("#recherche").val($(e).find("input[name=name]").val());
// 			$(e).find("input[name=matricule]").length && $("#pcatch").val($(e).find("input[name=matricule]").val());
// 			$("#recherche").next().trigger("click")
// 		},


// 	};
// })(jQuery);

window.addEventListener('load', () => {
    Report.init();
})

export default Report;