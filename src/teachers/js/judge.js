import('../../../pdms_teacher/css/style.css');
import('jquery');
import bootbox from '../../../pdms_js/bootbox';
import('../../../pdms_js/modal.js');
import { pdms, PDMS } from '../../components/pdms';

window.pdms = pdms;
window.PDMS = PDMS;

pdms.teacher.judge = function(a) {
	
	return {
		st: function(t) {
			t.preventDefault();
			
			var e=t.target.options[t.target.selectedIndex].value.split("&");
			
			e.length<3||a.ajax({
				url:"../pdms_sync/",
				type:"POST",
				dataType:"json",
				data:{fn:"teacher",act:10,statut:e[0],classe:e[1],matricule:e[2]},
				context:a(t.target),
				beforeSend:function(){this.attr({disabled:!0})},
				success:function(t){
					
					t.status&&this.removeAttr("disabled")
				}
			});
		},
		fn: function(e) {
			e.preventDefault();
			
			var v=e.target.options[e.target.selectedIndex].value, c = new PDMS().util.queryString().cl;
			
			a.ajax({
				url:"../pdms_sync/",
				type:"POST",
				dataType:"json",
				data:{fn:"teacher",act:11,c:c,a:v},
				context:a(e.target),
				beforeSend:function(){this.attr({disabled:!0})},
				success:function(t){
					console.log(t)
					t.status&&(location=t.url);
				}
			});
		},
		fn1: function(e) {
			e.preventDefault();
			
			parent.open('load.php?'+decodeURIComponent($(e.target).data().url), "Emproi du temps", "channemode=no,directories=no,fullscreen=no,menubar=no,resizable=no,status=no,titlebar=no,toolbar=no").resizeTo(250, 250);
		}
	}
}(jQuery);

export default pdms.teacher.judge;