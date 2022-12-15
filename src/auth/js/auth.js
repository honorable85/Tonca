/**
 * 
 */
 import('jquery');
 import bootbox from '../../../pdms_js/bootbox';
 import('../../../pdms_js/modal.js');
 import { pdms, PDMS } from '../../components/pdms';
 import $App from '../../components/app';

 PDMS.user = (function($) {
	return {};
}(jQuery));

pdms.auth.init = function() {
	if ($('.check').length) $('.check').each(function(i) { new PDMS().Prettyform.checkBox(this, null); });
	this.ld();
};

pdms.auth.abt = function(e) {
	e.preventDefault();
	
	bootbox.dialog({
		message: ' ',
		backdrop: true,
		closeButton: true
	});
}

$(function() { pdms.auth.init(); window.pdms = pdms; window.PDMS = PDMS; });