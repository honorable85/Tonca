/**
 * 
 */

import { PDMS } from './pdms';
import('jquery');

window.$ = jQuery
window.jQuery = jQuery;

PDMS.prototype.Tooltip = function(selector, mode) {
	
	mode = $(selector).data().mode || mode || 'default';
	
	var tooltip = null, container = null;
	var _this = this, max_width = 300, cursor_dim = {w: 12, h: 12}, left_gap = 0.2, right_gap = 0.8;
	if(!document.getElementById(mode + '-pdms-tooltip-wrp')) {
		tooltip = $('<div id="'+ mode + '-pdms-tooltip-wrp"></div>');
	    tooltip.css({
	    	position: 'absolute',
	    	left: -9999,
	    	top: 0,
			maxWidth: max_width
	    }).appendTo(document.body);
	} else {
		tooltip = $('#'+ mode + '-pdms-tooltip-wrp');
	}
	
	$(selector).hover(function(e){ 
		e.preventDefault();
		
		if (!this.dataset.title) return;
		
		let pos = this.dataset.position || 'bottom-center';
		
		_this.clean();
		tooltip.addClass(mode + '-tooltip-arrow-position-' + pos);
		
		_this.setContent(this.dataset.title);
		_this.show(this, pos);
	}, function(e){
		_this.hide();
	});
	
	this.hide = function() {
		tooltip.css({left: -9999, top: 0});
	};
	
	this.show = function(elt, pos) { 
		var elt_center_coords = {
				x: $(elt).offset().left + parseInt($(elt).outerWidth()/2),
				y: $(elt).offset().top + parseInt($(elt).outerHeight()/2)
			},
			pos = pos.split('-'),
			container_pos = pos[0],
			cursor_pos = pos[1], x, y;
			
		switch (container_pos) {
			
			case 'bottom':
				
				y = elt_center_coords.y + ($(elt).outerHeight()+cursor_dim.h)/2;
				
				if (cursor_pos === 'center') x = elt_center_coords.x - tooltip.outerWidth()/2;
				else if (cursor_pos === 'left') x = elt_center_coords.x - tooltip.outerWidth()*left_gap; // 10% tooltip width
				else if (cursor_pos === 'right') x = elt_center_coords.x - tooltip.outerWidth()*right_gap; // 90% tooltip width
			break;
			
			case 'top':
				
				y = elt_center_coords.y - tooltip.outerHeight() - ($(elt).outerHeight()+cursor_dim.h)/2;
				
				if (cursor_pos === 'center') x = elt_center_coords.x - tooltip.outerWidth()/2;
				else if (cursor_pos === 'left') x = elt_center_coords.x - tooltip.outerWidth()*left_gap; // 10% tooltip width
				else if (cursor_pos === 'right') x = elt_center_coords.x - tooltip.outerWidth()*right_gap; // 90% tooltip width
			break;
			
			case 'left':
			
				x = elt_center_coords.x - ($(elt).outerWidth() + cursor_dim.w)/2 - tooltip.outerWidth();
				
				if (cursor_pos === 'center') y = elt_center_coords.y - tooltip.outerHeight()/2;
				else if (cursor_pos === 'left') y = elt_center_coords.y - tooltip.outerHeight()*left_gap;
				else if (cursor_pos === 'right') y = elt_center_coords.y - tooltip.outerHeight()*right_gap;
			break;
			
			case 'right':
			
				x = elt_center_coords.x + ($(elt).outerWidth() + cursor_dim.w)/2;
				
				if (cursor_pos === 'center') y = elt_center_coords.y - tooltip.outerHeight()/2;
				else if (cursor_pos === 'left') y = elt_center_coords.y - tooltip.outerHeight()*left_gap;
				else if (cursor_pos === 'right') y = elt_center_coords.y - tooltip.outerHeight()*right_gap;
			break;
		}
		
		tooltip.offset({left: x, top: y});
	};
	
	this.clean = function() { tooltip[0].className = ''; };
	
	this.setContent = function(content) {
		tooltip.html(content);
	};
};

export default PDMS.prototype.Tooltip;