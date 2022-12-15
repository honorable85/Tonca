// JavaScript Document
import { Toast } from 'bootstrap';
import bootbox from '../../pdms_js/bootbox';
import('../../pdms_js/modal.js');
import('cropperjs/dist/cropper.css');
import Cropper from 'cropperjs';
import cameraHTML from '../../pdms_content/load/camera.html';
import cameraSettingsHTML from '../../pdms_content/load/cameraSettings.html';
import viewerHTML from '../../pdms_content/load/viewer.html';

jQuery.PDMS = jQuery.PDMS || function(){};
const PDMS = jQuery.PDMS;
PDMS.prototype = {};
PDMS.prototype.util = {
	register: function (a, cb) {
		cb = cb || null;
		if (this.__typeof(a) !== "array") throw new Error("Type Error: An array was expected as the first argument of register method.");
		
		for (var i=0; i<a.length; i++) {
			ext = a[i].substr(a[i].lastIndexOf('.')+1);
			
			if (ext.toLowerCase() === 'js') $.getScript(a[i], cb);
			else if (ext.toLowerCase() === 'css') 
				$('head').append('<link rel="stylesheet" type="text/css" href="' + a[i] + '">');
		}
	},
	
	sleep: function(ms) {
		
		var now = new Date();
		  now.setTime(now.getTime() + ms);
		  while (new Date().getTime() < now.getTime());
	},
	
	__typeof: function(o) {
		try {
	        return (o === self)? "global": ({}).toString.call(o).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
		} catch(ReferenceError) {/* ReferenceError */}
	},
	
	in_array: function(needle, stack, strict) { 
		for(let i=0, len=stack.length || 0; i<len; i++) { 
			if(strict) {
				if(this.equals(needle, stack[i])) {
					return i;
				}
			} else { 
				if(needle == stack[i]) {
					return i;
				}
			}
		}
	    return -1;
	},
	
	toggle: function(s, h1, h2) {
		var counter = 1; $(s).on('click', h1);
		return $(s).each(function(i) { 
			var that = this; 
			$(this).on('click', function(e) { 
			    //e.preventDefault();
				e.stopPropagation();
				$(that).unbind('click', (counter % 2) == 0 ? h2: h1); counter++; 
				$(that).bind('click', (counter % 2) == 0 ? h2: h1);
			});
		});
	},
	
	equals: function(o1, o2) {
		if(this.__typeof(o1) !== this.__typeof(o2)) return false;
		
		switch(this.__typeof(o1)) {
		case 'function': 
			return o1.prototype === o2.prototype;
		case 'array':
			if(o1.length !== o2.length) return false;
			for(var i=0; i<o1.length; i++) {
				if(this.in_array(o1[i], o2, true) == -1) return false;
			}
			return true;
		case 'object': 
			if(o1.length != o2.length) return false;
			for(p in o1) {
				if(!o1.hasOwnProperty(p)) continue;
				if(this.__typeof(p) === 'object' && !arguments.callee(o1[p], o2[p])) return false;
				if(o2[p] !== o1[p]) return false;
			}
			return true;
		case 'number': ;
		case 'boolean': ;
		case 'string': ;
		default: return o1 === o2;
		}
	},
	
	inherit: function(o) {
		if(o === null) return null;
		if(o === undefined) return undefined;
		if(Object.create) return Object.create(o);
		f = function(){};
		f.prototype = o;
		return new f();
	},
	
	browser: function() {
		var s = navigator.userAgent.toLowerCase(); 
		var match = /(webkit)[ \/]([\w.]+)/.exec(s) ||
		            /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(s) ||
				    /(msie) ([\w.]+)/.exec(s) ||
				    !/compatible|like/.test(s) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(s) ||
				    []; 
		return { name: match[1] || "", version: match[2] || "0" };
	},
	
	queryString: function() {
		
		var args = new Object( );
	    var query = location.search.substring(1);    
	    var pairs = query.split("&");                
	    for(var i = 0; i < pairs.length; i++) {
	        var pos = pairs[i].indexOf('=');          
	        if (pos == -1) continue;                  
	        var argname = pairs[i].substring(0,pos);  
	        var value = pairs[i].substring(pos+1);    
	        value = decodeURIComponent(value);        
	        args[argname] = value;                   
	    }
	    
	    return args;
	},
	shake: function(e, oncomplete, distance, time) {
			
		if (typeof e === "string") e = document.getElementById(e);
		if (!time) time = 500;
		if (!distance) distance = 5;
		var originalStyle = e.style.cssText; 
		e.style.position = "relative"; 
		var start = (new Date()).getTime(); 
		animate(); 
		function animate() {
			var now = (new Date()).getTime();
			var elapsed = now-start; 
			var fraction = elapsed/time; 
			if (fraction < 1) { 
				var x = distance * Math.sin(fraction*4*Math.PI);
				e.style.left = x + "px";
				setTimeout(animate, Math.min(25, time-elapsed));
			} else { 
				e.style.cssText = originalStyle 
				if (oncomplete) oncomplete(e); 
			}
		}
	},
	snap: function(e, o, c, cb) {
		e.preventDefault();
		e.stopPropagation();
		
		o = o || null;
		c = c || null;
		cb = cb || null;
		
		box = bootbox.dialog({
				  message: '<strong>Chargement en cours ...</strong>',
				  size: 'small',
				  closeButton: false,
				  className: 'pdms-snap',
				  backdrop: false,
				  callback: cb
			  });
	},
	camSettings: function() {
		
		if (!window.stream) return;
		
		var videoSelect = null, cont = null, videoElement = null;
		
		box2 = bootbox.dialog({
			message: '<strong>Chargement en cours ...</strong>',
			size: 'small',
			closeButton: false,
			className: 'pdms-snap-camaera-settings',
			backdrop: false,
			callback: function() {
				
				cont = $('.pdms-snap-camaera-settings');
				
				cont.find('.bootbox-body').html(cameraSettingsHTML);
				videoSelect = cont.find('select')[0];
				videoElement = box.find('video')[0];
				imgElement = box.find('img')[0];
				canvas = box.find('canvas')[0];
				
				navigator.mediaDevices.enumerateDevices()
				.then(gotDevices).then(getStream).catch(handleError);
				
				cont.find('select').each(function(i) { new PDMS().Prettyform.Textbox(this); });
				cont.find('select').first().on('change', getStream);
				
				cont.find('a').last().on('click', function(e) { $(videoSelect).trigger('change'); box2.modal('hide'); }).prev().on('click', function(e) { box2.modal('hide'); });
			}
		});
		
		function gotDevices(deviceInfos) {
			
			for (i = 0; i !== deviceInfos.length; ++i) {
				
				const deviceInfo = deviceInfos[i];
				const option = document.createElement('option');
				
				option.value = deviceInfo.deviceId;
				
				if (deviceInfo.kind === 'videoinput') {
					
				  option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
				  videoSelect.appendChild(option);
				}
			}
		}
		
		function getStream() {
			
			stopStreaming();
			
		    var res = cont.find('select').last().val().split('x');
		  	
			const constraints = {
			  video: {
				deviceId: {exact: videoSelect.value},
				width: { max: res[0] },
				height: { max: res[1] }
			  }
			};
		  
			navigator.mediaDevices.getUserMedia(constraints). 
			  then(gotStream).catch(handleError);
		}
		
		function gotStream(stream) {
			
			window.stream = stream; // make stream available to console
			videoElement.srcObject = stream;
		}
		
		function handleError(error) {
			console.error('Error: ', error);
		}
		
		function stopStreaming() {
			
			if (window.stream) {
				
				window.stream.getTracks().forEach(function(track) {
				  track.stop();
				});
			}
		}
	}
};
PDMS.prototype.Prettyform = {
	Textbox: function(elt) {
		
		var wrp = $('<span class="pf-element-wrp pf-textbox-wrp"></span>'),
		    ph = $('<span class="placeholder"></span>'),
			ph_text = $(elt).attr('placeholder');
			
		wrp.insertBefore(elt).append(elt, ph);
		
		$(elt).on('focus', function(e) { 
			wrp.addClass('focus'); 
			ph.text(ph_text); 
			$(elt).attr('placeholder', '');
		}).on('blur', function(e) { 
			wrp.removeClass('focus'); 
			ph.text('');
			$(elt).attr('placeholder', ph_text);
		});
	},
	Combobox : function(elt, callback) {
		var wrp = $('<span class="pf-element-wrp pf-combobox-wrp"></span>');
		var list = $('<ul class="pf-combobox-prettycombo"></ul>');
		var selected = $('<li class="pf-combobox-selected"></li>');
		var val_span = $('<span class="pf-combobox-value"></span>');
		var opt_list = $('<ul class="pf-combobox-optionlist"></ul>');
		    
		$(elt).addClass('pf-hide');
		wrp.append(list.append(selected.append(val_span, opt_list))).insertBefore(elt).append(elt);
		selected[0].style.cssText = elt.style.cssText;
		list.css({width: $(elt).outerWidth()});
		
		if(elt.disabled) selected.addClass('pf-combobox-disabled');
		
		$(elt).find('option').each(function(i) {
			var settings = {}, data = $(this).data();
			if(data.style) settings.style = data.style;
			if(this.selected) settings.selected = 1;
			
			addItem(this, settings);
		});
		
		if(!elt.disabled) { 
			new PDMS().util.toggle(selected[0],
					function(e) { 
						e.preventDefault(); e.stopPropagation();
						opt_list.show(); 
					}, function(e) { 
						e.preventDefault(); e.stopPropagation();
						opt_list.hide();
					});
		    var curr_opt = null;
			selected.find('.pf-combobox-option').each(function(i){
				$(this).on('click', function(e) { 
				    curr_opt = curr_opt || this;
					$(curr_opt).removeClass('pf-combobox-selected-option');
					curr_opt = this;
					$(this).addClass('pf-combobox-selected-option');
					
					var value = $(this).data().value, text = $(this).text();
					val_span.text(text);
					$(elt).val(value); 
					$(elt).trigger('change').trigger('click');
					selected.trigger('click');
					$(this).parents('.pf-combobox-prettycombo').toggleClass('focus');
					if(callback) callback(value, this);
				});
				$(document).on('click', function(e){
					if(opt_list.css('display') == 'block') selected.trigger('click');
				});
			});
		}
		
		/*
		 * Add a new item to the list
		 * @params value the content value of the new item.
		 * @params settings, it could be item settings; possible parametters are
		 *     {
		 *         style: string,
		 *         selected: boolean
		 *     }
		 */
		function addItem(elt, settings) { 
			if(elt.selected) val_span.html($(elt).text());
			item = $('<li class="pf-combobox-option">' + $(elt).html() + '</li>');
			item.data('value', elt.value);
			if(settings.style) item[0].style.cssText = settings.style;
			opt_list.append(item);
		}
	},
	SelectButton: function(elt, callback) {
		
		var wrp = $('<span class="pf-element-wrp pf-selectbutton-wrp"></span>');
		var list = $('<ul class="pf-selectbutton"></ul>');
		var selected = $('<li class="pf-selectbutton-selected"></li>');
		var val_span = $('<span class="pf-selectbutton-value"></span>');
		var opt_list = $('<ul class="pf-selectbutton-optionlist"></ul>');
		var icon = $('<i class="fa fa-caret-right pf-selectbutton-icon"></i>');
		
		$(elt.className.split(' ')).each(function(i,v) {
            val_span.addClass(v);
        });
		
		$(elt).addClass('pf-hide');
		
		wrp.append(list.append(selected.append(val_span, icon, opt_list))).insertBefore(elt).append(elt);
		selected[0].style.cssText = elt.style.cssText;
		list.css({width: $(elt).outerWidth()});
		
		if(elt.disabled) selected.addClass('pf-selectbutton-disabled');
		
		$($(elt).data('options').split(',')).each(function(i, v) {
			
			addItem(v);
		});
		
		val_span.html($(elt).data('options').split(',')[0].trim());
		elt.dataset.value = $(elt).data('options').split(',')[0].trim();
		
		val_span.html($(elt).data('options').split(',')[0]);
		
		if(!elt.disabled) { 
			
			new PDMS().util.toggle(icon[0],
					function(e) { 
						e.preventDefault(); e.stopPropagation();
						opt_list.show(); 
					}, function(e) { 
						e.preventDefault(); e.stopPropagation();
						opt_list.hide();
					});
					
			val_span.on('click', function(e) { $(elt).trigger('click'); });
			
		    var curr_opt = null;
		    
			selected.find('.pf-selectbutton-option').each(function(i){
				
				$(this).on('click', function(e) { 
				    curr_opt = curr_opt || this;
					$(curr_opt).removeClass('pf-selectbutton-selected-option');
					curr_opt = this;
					$(this).addClass('pf-selectbutton-selected-option');
					
					var value = $(this).data().value, text = $(this).text();
					val_span.text(text);
					elt.dataset.value = value.trim();
					icon.trigger('click');
					if(callback) callback(value.trim());
				});
				
				$(document).on('click', function(e){
					if(opt_list.css('display') === 'block') icon.trigger('click');
				});
			});
		}
		
		function addItem(v) {
			
			item = $('<li class="pf-selectbutton-option">' + v + '</li>');
			item.data('value', v);
			opt_list.append(item);
		}
	},
	switchButton: function(elt, callback) { 
		if(elt.nodeName != 'INPUT' && elt.type.toLowerCase() != 'checkbox') return;
		
		var wrp = $('<span class="prettyform-switchbutton-wrp"></span>'), label = $('<label></label>');
		wrp.append(label).insertBefore(elt).append(elt);
		
		$(elt).css({display: 'none'});
		
		label.addClass(function(){
			if(elt.checked) return 'switch-on';
			return '';
		}).on('click', function(e){
			if($(this).hasClass('switch-on')) {
				$(elt).removeAttr('checked');
				$(this).removeClass('switch-on');
				if(callback) callback(elt, false);
			} else {
				$(elt).attr({checked: true});
				$(this).addClass('switch-on');
				if(callback) callback(elt, true);
			}
		});
	},
	checkBox: function(elt, callback) {
		var wrp = $('<span class="pf-checkbox-wrp"></span>'), label = $('<label></label>');
		wrp.insertBefore(elt).append(elt, label);
		
		$(elt).css({display: 'none'});
		
		label.addClass(function(){
			if(elt.checked) return 'check-on';
			return '';
		}).on('click', function(e){
			if($(this).hasClass('check-on')) {
				$(elt).removeAttr('checked');
				$(this).removeClass('check-on');
				if(callback) callback(elt, false);
			} else {
				$(elt).attr({checked: true});
				$(this).addClass('check-on');
				if(callback) callback(elt, true);
			}
		});
	},
	spin: function(elt) {
		if(elt.nodeName != 'INPUT' && elt.type.toLowerCase() != 'number') return;
		
		var wrp = $('<span class="prettyform-spin-wrp"></span>'), 
		    minus_but = $('<button>-</button>'), 
		    plus_but = $('<button>+</button>'),
            textfield = $('<input type="text" size="' + elt.size + '">');
		
		wrp.append(minus_but, textfield, plus_but).insertBefore(elt).append(elt);
		$(elt).addClass('pf-hide');
		
		if(!elt.max) elt.max = 0;
		else elt.max = parseInt(elt.max);
		
		if(!elt.min) elt.min = 0;
		else elt.min = parseInt(elt.min);
		
		if(!elt.value) elt.value = elt.min;
		textfield.val(parseInt(elt.value));
		
		minus_but.on('click', function(e){
			e.preventDefault();
			value = textfield.val();
			if(value <= elt.min) return;
			elt.value = parseInt(value) - 1;
			textfield.val(elt.value);
		});
		
		plus_but.on('click', function(e){ 
		    e.preventDefault();
		    value = textfield.val(); 
			if(value == elt.max) return;
			elt.value = parseInt(value) + 1;
		    textfield.val(elt.value);
		});
		
		textfield.on('input', function(e){ 
			if(parseInt(this.value) <= parseInt(elt.max) && parseInt(this.value) >= parseInt(elt.min)) elt.value = this.value; 
			this.value = elt.value;
		});
	},
	
	searchBox: function(elt) {
		var wrp = $('<span class="pf-search-box-wrp"></span>'), input = $('<input class="pf-search-box-submit" type="submit" name="submit" value=""/>').css({display: 'none'});
		var sicon = $('<i class="fa fa-search pf-search-box-len"></i>'), cicon = $('<i class="fa fa-times-circle pf-search-box-cancel"></i>');
		
		wrp.insertBefore(elt).append(elt, input, cicon, sicon); 
		
		var sl = -(sicon.width() + $(elt).outerWidth() - cicon.width() - parseInt($(elt).css('padding-left'))/3 - parseInt($(elt).css('padding-right'))/2);
		var cl = - cicon.width() - parseInt($(elt).css('padding-right'))/2;
		var fs = parseInt($(elt).css('font-size')), col = $(elt).css('color'), fw = $(elt).css('font-weight'); 
		
		sicon.on('click', function(e){ 
			e.preventDefault(); 
			input.trigger('click');
		}).css({marginLeft: sl, fontSize: fs, color: col, fontWeight: fw, cursor: 'pointer'});
		
		cicon.on('click', function(e) { 
			e.preventDefault(); 
			e.stopPropagation();
			$(elt).focus().val(""); 
			$(this).css({visibility: 'hidden'});
		}).css({marginLeft: cl, visibility: 'hidden', fontSize: fs, color: col, fontWeight: fw, cursor: 'default'});
		
		$(elt).on('input', function(e) { 
			e.preventDefault();
			e.stopPropagation();
			if(this.value != '') 
				cicon.css({visibility: 'visible'}); 
		});
	},
	
	radio: function(elt, previous, current) {
		var name = elt.name;
		if(!name.length) {
		    throw new Error('Can not prettyfy a radio with empty name.'); return;
		}
		if(elt.type && elt.type.toLowerCase() != 'radio') {
			throw new TypeError('The element to prettyfy must be of type radio.'); return;
		}
		var grp_radio = [];
		$('input[name=' + name + ']').each(function(i) {
			if(this.type.toLowerCase() == 'radio') 
				grp_radio.push(this);
		});
		
		var curr = null;
		$.each(grp_radio, function(i, radio) {
			var wrp = jQuery('<span class="pf-radio-wrp"></span>'), label = $('<label></label>'); 
			wrp.insertBefore(radio).append(label, radio); 
			$(radio).css({display: 'none'}); 
			$(label).on('click', function(e) {
				e.preventDefault(); 
				curr = curr || this;
				curr.className = '';  
				$(curr.nextElementSibling).trigger('click');
				if(previous) 
					previous(curr.nextElementSibling);
				curr = this;
				curr.className = 'check-on'; 
				$(curr.nextElementSibling).trigger('click');
				if(current)
					current(curr.nextElementSibling);
			});
			if(radio.checked)
			    $(label).trigger('click');
		});
	}
};
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
const pdms = (function($) { return {}; })(jQuery);
pdms.master = (function($) { return {}; })(jQuery);
pdms.teacher = (function($) { return {}; })(jQuery);
pdms.supervisor = (function($) { return {}; })(jQuery);
pdms.parent = (function($) { return {}; })(jQuery);
pdms.master.room = (function($) {
	
	return {
		fdt: function(e, a, cb) {
			e.preventDefault();
			e.stopPropagation();
			
			$.ajax({
				url: '../pdms_sync/',
				type: 'POST',
				dataType: 'html',
				data: { fn: 'master', act: a, v: e.target.options[e.target.selectedIndex].value },
				context: $(e.target),
				beforeSend: function() { this.attr({disabled: true}); },
				complete: function() { this.removeAttr('disabled'); },
				success: function(r) { cb(r, a); }
			});
		}
	};
})(jQuery);
pdms.ui = (function($) {
	
	var clear_interval = null, cli = null;
	var ctrl = null, ctrl2 = null, video, img, canvas, cropper = null, cropper2 = null;
	
	return {
		ALERT_LOADING: 'Chargement en cours, veuillez patienter ...',
		init: function() {
			
			var __this = this;
			
			if ($('#sidebar').length) {
				
				this.sb();
				
				$(window).on("load", function() { __this.sb(); });
				$(window).on("resize", function() { __this.sb(); });
				$(window).on("orientationchange", function() { __this.sb(); });
				
				$('#sidebar > ul > li').not('li:first').each(function(i) {
					
					$(this).on('click', function(e) {
						e.preventDefault();
						e.stopPropagation();
						
						var target = e.target;
						while(target.nodeName !== 'LI') target = target.parentNode;
						
						cli = cli || target;
						$(cli).removeClass('active');
						cli = target;
						$(cli).addClass('active');
						
						a = $(target).find('a');
						$('#container > div:last > iframe').get(0).src = 'load.php?fn='+a.attr('target'); 
						$('#container > h2').html(a.data().title+'<button onClick="history.back()" class="pf-btn pf-btn-default ms-5" type="button"><i class="bi bi-arrow-return-left"></i>Retour</button>');
						if ($('.alert').length) __this.notify(__this.ALERT_LOADING, 'loading');
					});
				});
				$('#sidebar > ul > li').not('li:first').first().trigger('click');
				
				new PDMS().util.toggle($('#sidebar > ul > li:first'), 
					function(e) {
						
						$(e.target).parents('ul').find('li').not('li:first').find('span,i').hide(400);
						$(e.target).parents('ul').next().hide(400);
						e.target.dataset.title = 'Elargir menu';
						e.target.dataset.position = 'bottom-left';
					}, 
					function(e) {
						
						$(e.target).parents('ul').find('li').not('li:first').find('span,i').show(400);
						$(e.target).parents('ul').next().show(400);
						e.target.dataset.title = 'Effondrer menu';
						e.target.dataset.position = 'bottom-center';
					}
				);
				
				new PDMS().util.toggle($('#lang'), 
					function(e) {
						
						var target = e.target;
						while (target.nodeName !== 'LI') target = target.parentNode;
						
						var lst = $(target).children('ul');
						lst.show();
						
						$(document).on('click', function(e) { 
							
							if (e.target !== lst || $.inArray(e.target, lst.children()) === -1) lst.hide();
						});
					}, 
					function(e) {
						
						var target = e.target;
						while (target.nodeName !== 'LI') target = target.parentNode;
						
						$(target).children('ul').hide();
					}
				);
			}
			
			if ($('.v-scroll').length)
				$.getScript('../../pdms_js/scroller.js', function(e) {
					
					$(document.body).append('<link rel="stylesheet" type="text/css" href="../../pdms_css/scroller.css"/>');
					
					$('.v-scroll').mCustomScrollbar({
						axis:"y",
						theme: "inset-dark",
						advanced:{
							autoExpandVerticalScroll:true
						}
					});
				});
				
			$('.pf-textbox').each(function(index, element) {
            	new PDMS().Prettyform.Textbox(element);
        	});
			if ($('.pdms-m').length) pdms.auth.pull();
			if ($('.tooltip').length) 
				$.getScript('../../pdms_js/tooltip.js', function(e) { 
					
					$(document.body).append('<link rel="stylesheet" type="text/css" href="../../pdms_css/tooltip.css"/>');
					
					$('.tooltip').each(function(index, element) {
						new PDMS().Tooltip(this, 'info');
					});
				});
				
			if ($('.ddm').length) 
				$.getScript('../../pdms_js/ddm.js', function() {
					
					$('.ddm').each(function(index, element) {
                        new PDMS().DDM(element);
                    });
				});
				
			if ($('.pf-check').length)
				$('.pf-check').each(function(index, element) {
                    new PDMS().Prettyform.checkBox(element);
                });
				
			// Pick date
			if ($('.pf-textbox.date').length) 
				$.getScript('../../pdms_js/datepicker.js', function() {
					
					$(document.body).append('<link rel="stylesheet" type="text/css" href="../../pdms_css/datepicker.css"/>');
					
					$('.pf-textbox.date').datepicker({
						autoHide: true,
						zIndex: 2048,
						format: 'yyyy-mm-dd',
						language: 'fr-FR',
					});
				});
				
			// Update
			$.ajax({
				url: '../pdms_sync/',
				type: 'POST',
				dataType: 'json',
				data: { fn: 'com', pn: 'sys', act: 7 },
				success: function(r) {
					
					if (r.status) {
						
						if (!Notification) alert('Votre navigateur est obsélète. Plusieurs fonctionnalités ne seront pas prises en compte');
						else {
							
							if (Notification.permission !== 'granted') Notification.requestPermission();
							else {
								
								var not = new Notification('Mise à jour disponible !', 
									{
										icon: '../pdms_img/update.png',
										body : 'Une mise à jour recommandée pour votre système.',
										data: { target: 'update', title: 'Mise à jour' }
									});
									
								not.onclick = function() {
									
									pdms.ui.cfln(event)
								}
							}
						}
					}
				}
			});
			
			// resize menu
			if ($('.tabbed-pan').length) {
				
				var container = $('.tabbed-pan').wrap($('<div class="full pan-m"></div>'));
				$('<a href="javascript:void(0)">&laquo;</a>').insertBefore(container);
				$('<a href="javascript:void(0)">&raquo;</a>').insertAfter(container);
				
				container.width($('.pan-m').width()-60);
				container = container[0];
				
				var lps = $('.pan-m > a:first'), rps = $('.pan-m > a:last');
				
				$.getScript('js/ps.js', function(e) {
					
					$(document.body).append('<link rel="stylesheet" type="text/css" href="css/ps.css"/>');
					
					new PerfectScrollbar(container, {
						wheelSpeed: 2,
						wheelPropagation: true,
						minScrollbarLength: 20,
						swipeEasing: true,
						suppressScrollY: true
					});
					
					$(container).on('ps-scroll-x', function(e) {
				
						var pct = Math.ceil(container.scrollLeft/(container.scrollWidth - $(container).width())*100);
						
						if (pct == 0) { lps.css({display: 'none'}); rps.css({display: 'block'}); }
						else if (pct == 100) { lps.css({display: 'block'}); rps.css({display: 'none'}); }
						else if (pct > 20 && pct < 60) { lps.css({display: 'block'}); rps.css({display: 'block'}); }
					});
					
					lps.on('click', function(e) { $(container).animate({ scrollLeft: container.scrollLeft-160 }, 400); });
					rps.on('click', function(e) { $(container).animate({ scrollLeft: container.scrollLeft+160 }, 400); });
				});
			}
		},
		rzm: function() {
			
			var act_elt =  $('.tabbed-pan .active'), lrange = 0, rrange = 0, gap = 5, c = $('.tabbed-pan'), prev = act_elt.prev(), next = act_elt.next(), cw = c.parent().width(), aw = act_elt.width();
					
			while (prev.length && prev[0].nodeName === 'LI') { lrange += prev.width(); prev = prev.prev(); }
			while (next.length && next[0].nodeName === 'LI') { rrange += next.width(); next = next.next(); }
			
			if (lrange + aw > cw) {
				
				while (lrange + aw + act_elt.next().width() > cw) { 
					
					lrange -= c.children('li').first().next().width();
					c.children('li').first().next().prependTo(c.children('li').first().children('ul')); 
				}
				
				c.children('li').first().next().prependTo(c.children('li').first().children('ul'));
				
				while (rrange > act_elt.next().width() + c.children('li').last().width()) {
					
					c.children('li').last().prev().prependTo(c.children('li').last().children('ul'));
					rrange -= c.children('li').last().prev().width();
				}
			} else if (rrange + aw > cw) {
				
				while (rrange + aw + act_elt.prev().width() > cw) { 
					
					rrange -= c.children('li').last().prev().width();
					c.children('li').last().prev().prependTo(c.children('li').last().children('ul')); 
				}
				
				c.children('li').last().prev().prependTo(c.children('li').last().children('ul'));
				
				while (lrange > act_elt.prev().width() + c.children('li').first().width()) {
					
					c.children('li').first().next().prependTo(c.children('li').first().children('ul'));
					lrange -= c.children('li').first().next().width();
				}
			} else if ((lrange + aw > cw/2) && (lrange + aw + rrange > cw)) {
				
				while (lrange + aw + rrange < cw) { 
					
					rrange -= c.children('li').last().prev().width();
					c.children('li').last().prev().prependTo(c.children('li').last().children('ul')); 
				}
				
				c.children('li').last().prev().prependTo(c.children('li').last().children('ul'));
			} else if ((rrange + aw > cw/2) && (rrange + aw + lrange > cw)) {
				
				while (rrange + aw + lrange < cw) { 
					
					lrange -= c.children('li').first().next().width();
					c.children('li').first().next().prependTo(c.children('li').first().children('ul')); 
				}
				
				c.children('li').first().next().prependTo(c.children('li').first().children('ul'));
			}
			
			c.find('ul').each(function(index, element) {
                
				if ($(this).children('li').length == 0) $(this).parent('li').hide();
            });
		},
		psll: function(n) {
			
			$('html, body').animate({scrollTop: n}, 1000);
		},
		sb: function() {
			
			$('#sidebar').height(new (new PDMS()).Geometry().getViewportSize().h);
		},
		cf: function(e) {
			
			var o = $(e.target);
			o.height(o.get(0).contentWindow.document.body.scrollHeight);
			
			w = window;
			box = $(w.document.body).find('.alert');
			
			if (box.length === 0) w = parent;
			
			box = $(w.document.body).find('.alert');
			
			w.clearInterval(clear_interval); 
			box.css({visibility: 'hidden'});
		},
		cfl: function(fn) {
			
			var o = $('#container iframe').get(0) || $(parent.document.getElementById('container')).find('iframe').get(0);
			$(o).height(o.contentWindow.document.body.scrollHeight);
			
			o.src = 'load.php?fn='+fn;
			
			this.notify(this.ALERT_LOADING, 'loading');
		},
		cflh: function(e) {
			
			var a = e.target;
			while (a.nodeName !== 'A') a = a.parentNode;
			
			a = $(a);
			w = window;
			if ($(w.document.body).find('#container').length === 0) w = parent;
			
			cont = $(w.document.body).find('#container');
			iframe = cont.find('iframe');
			
			iframe.get(0).src = 'load.php?fn='+a.data().target; 
			cont.children('h2').html(a.data().title);
			if ($(w.document.body).find('.alert').length) this.notify(this.ALERT_LOADING, 'loading');
		},
		cfln: function(e) {
			
			w = window;
			if ($(w.document.body).find('#container').length === 0) w = parent;
			
			cont = $(w.document.body).find('#container');
			iframe = cont.find('iframe');
			
			iframe.get(0).src = 'load.php?fn='+e.target.data.target; 
			cont.children('h2').html(e.target.data.title);
			if ($(w.document.body).find('.alert').length) this.notify(this.ALERT_LOADING, 'loading');
		},
		rpl: function(fn) {
			
			var o = $('#container iframe').get(0) || $(parent.document.getElementById('container')).find('iframe').get(0);
			$(o).height(o.contentWindow.document.body.scrollHeight);
			
			o.src = 'plugin.php?fn='+fn;
			
			this.notify(this.ALERT_LOADING, 'loading');
		},
		win: function(url, title, param) {
			if (param) param = "channemode=no,directories=no,fullscreen=no,menubar=no,resizable=no,status=no,titlebar=no,toolbar=yes";
			else param = "";
			parent.open(url, title, param);
		},
		notify: function(msg, type, duration) {
			
			let w = window;
			
			if (window.opener) w = window.opener;
			
			let box = $(w.document.body).find('.alert');
			if (box.length === 0) box = $(w.parent.document.body).find('.alert');
			
			w.clearInterval(clear_interval);
			
			type = type || 'loading';
			duration = duration || 5000;
			
			this.format(type);
			
			box.css({visibility: 'visible'}).html(msg);
			clear_interval = w.setInterval(function() { box.css({visibility: 'hidden'}); }, duration);
		},
		format: function(type) {
			
			let cls = ['loading', 'error', 'success'], w = window;
			
			if (window.opener) w = window.opener;
			
			let box = $(w.document.body).find('.alert');
			if (box.length === 0) box = $(w.parent.document.body).find('.alert');
			
			if (!type) return;
			
			for (let i=0; i<cls.length; i++) box.removeClass(cls[i]);
			if (box && box[0]) box[0].className = 'alert';
			
			if (type === 'loading') box.addClass('loading');
			else if (type === 'error') box.addClass('error');
			else if (type === 'success') box.addClass('success');
		},
		print: function() {
			
			if ($('#runhead').length === 0) $(document.body).append('<div id="runhead"><span>PDMS/POB&Egrave;</span></div>');
			print();
		},
		ctxm: function(e, cb) {
			e.preventDefault();
			e.stopPropagation();
			
			$(e.target).trigger('click');
			
			$('#contextmenu').css({left: e.clientX, top: e.clientY});
			
			if (cb) cb(e.target);
			
			$(document).on('click', function(e) {
				
				var contextmenu = $('#contextmenu')[0];
				
				if (parseInt(contextmenu.style.left) > 0) contextmenu.style.left = '-999px';
			});
		},
		auto_complete: function(inp, arr, req, cb, dup) {
			
			/*the autocomplete function takes two arguments,
			the text field element and an array of possible autocompleted values:*/
			
			var currentFocus, url = '#';
			
			/*execute a function when someone writes in the text field:*/
			inp.addEventListener("input", function(e) {
				var a, b, i, val = this.value;
				/*close any already open lists of autocompleted values*/
				closeAllLists();
				if (!val) { return false;}
				//currentFocus = -1;
				currentFocus = 0;
				/*create a DIV element that will contain the items (values):*/
				a = document.createElement("DIV");
				a.setAttribute("id", this.id + "autocomplete-list");
				a.setAttribute("class", "autocomplete-items");
				/*append the DIV element as a child of the autocomplete container:*/
				this.parentNode.appendChild(a);
				
				/*for each item in the array...*/
				for (i = 0; i < arr.length; i++) {
					/*check if the item starts with the same letters as the text field value:*/
					if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) { 
					  
					  if (!dup) {
						  
						  b = document.createElement("DIV");
						  req(b, arr[i], arr[i].substr(0, val.length));
						  b.addEventListener("click", function(e) {
							  cb(this);
							  closeAllLists();
						  });
						  a.appendChild(b);
					  } else {
						  
						  b1 = document.createElement("DIV");
						  b2 = document.createElement("DIV");
						  req([b1,b2], arr[i], arr[i].substr(0, val.length));
						  b1.addEventListener("click", function(e) {
							  cb(this);
							  closeAllLists();
						  });
						  a.appendChild(b1);
						  b2.addEventListener("click", function(e) {
							  cb(this);
							  closeAllLists();
						  });
						  a.appendChild(b2);
					  }
					}
				}
			});
			
			/*execute a function presses a key on the keyboard:*/
			inp.addEventListener("keydown", function(e) {
				var x = document.getElementById(this.id + "autocomplete-list");
				if (x) x = document.querySelectorAll('div.result-box');
				if (e.keyCode == 40) {
				  /*If the arrow DOWN key is pressed,
				  increase the currentFocus variable:*/
				  currentFocus++;
				  /*and and make the current item more visible:*/
				  addActive(x);
				} else if (e.keyCode == 38) { //up
				  /*If the arrow UP key is pressed,
				  decrease the currentFocus variable:*/
				  currentFocus--;
				  /*and and make the current item more visible:*/
				  addActive(x);
				} else if (e.keyCode == 13) {
				  /*If the ENTER key is pressed, prevent the form from being submitted,*/
				  e.preventDefault();
				  if (currentFocus > -1) {
					/*and simulate a click on the "active" item:*/
					if (x) x[currentFocus].click();
				  }
				}
			});
			
			function addActive(x) {
				/*a function to classify an item as "active":*/
				if (!x) return false;
				/*start by removing the "active" class on all items:*/
				removeActive(x);
				if (currentFocus >= x.length) currentFocus = 0;
				if (currentFocus < 0) currentFocus = (x.length - 1);
				/*add class "autocomplete-active":*/
				x[currentFocus].classList.add("autocomplete-active");
			}
			
			function removeActive(x) {
				/*a function to remove the "active" class from all autocomplete items:*/
				for (var i = 0; i < x.length; i++) {
				  x[i].classList.remove("autocomplete-active");
				}
			}
			
			function closeAllLists(elmnt) {
			  /*close all autocomplete lists in the document,
			  except the one passed as an argument:*/
			  var x = document.getElementsByClassName("autocomplete-items");
			  for (var i = 0; i < x.length; i++) {
				if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			  }
			}
		  }
		  /*execute a function when someone clicks in the document:*/
		  document.addEventListener("click", function (e) {
			  closeAllLists(e.target);
		  });
		},
		webcam: function() {
		
			var cont = $('.pdms-snap').find('.bootbox-body');
				
				video = cont.find('.snap-cam').find('video')[0];
				img = cont.find('.snap-cam').find('img')[0];
				canvas = cont.find('.snap-cam').find('canvas')[0];
				
				video.width = cont.find('.snap-cam').width();
				video.height = cont.find('.snap-cam').height();
				
				canvas.style.display = video.style.display = 'block';
				img.style.display = 'none';
				
				navigator.mediaDevices.getUserMedia({video: true, width: 1280, height: 720})
				.then(function(stream){
					
					video.srcObject = stream;
					window.stream = stream;
					
					video.onloadedmetadata = function(e) {
						video.play();
						video.oncontextmenu = function(e) { pdms.ui.ctxm(e, null); }
					};
				})
				.catch(function(err) { console.log(err.name + ' : ' + err.message); });
				
				cont.children('p').find('a').first().on('click', function(e) {
					pdms.ui.clean_webcam();
				}).next().on('click', this.capture);
		},
		init_webcam: function() {
			
			var that = this;
			
			$('.pdms-snap').find('.bootbox-body').html(cameraHTML);
			$('.pdms-snap .bootbox-body > ul > li').each(function(i) {
					
				var disp = $('.pdms-snap .bootbox-body > div > div').hide(400);
				
				$(this).on('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
					
					var target = e.target;
					while(target.nodeName !== 'LI') target = target.parentNode;
					
					cli = cli || target;
					$(cli).removeClass('active');
					$(disp.get($(cli).index())).hide(400);
					
					cli = target;
					$(cli).addClass('active');
					$(disp.get($(cli).index())).show(400);
				});
			});
			$('.pdms-snap .bootbox-body > ul > li').first().trigger('click');
			
			$('.snap-cam > div:last-child > table a').each(function(i) {
				
				$(this).on('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
					
					var target = e.target;
					
					ctrl = ctrl || target;
					$(ctrl).removeClass('active');
					
					ctrl = target;
					$(ctrl).addClass('active');
				});
			});
			
			$('.snap-upload > div:last-child > table a').each(function(i) {
				
				$(this).on('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
					
					var target = e.target;
					
					ctrl2 = ctrl2 || target;
					$(ctrl2).removeClass('active');
					
					ctrl2 = target;
					$(ctrl2).addClass('active');
				});
			});
			
			pdms.ui.webcam();
			$(document.body).append('<ul class="list" id="contextmenu" tabindex="1">' +
										'<li>' +
											'<a onClick="pdms.ui.play_video()" href="javascript:void(0)">' +
												'<i class="fa fa-play"></i>' +
												' Jouer</a>' +
										'</li>' +
										'<li>' +
											'<a onClick="new PDMS().util.camSettings()" href="javascript:void(0)">' +
												'<i class="fa fa-wrench"></i>' +
												' Paramètres</a>' +
										'</li>' +
									'</ul>');
		},
		capture: function(e) {
			
			pdms.ui.stop_webcam();
			window.stream = null;
			
			if (cli.textContent == 'Camera') {
				
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				canvas.getContext('2d').drawImage(video, 0, 0);
				// Other browsers will fall back to image/png
				img.src = canvas.toDataURL('image/webp');
				
				$('.snap-cam > div:last-child').css({display: 'block'});
				canvas.style.display = video.style.display = 'none';
				img.style.display = 'block';
				
				$(e.target).replaceWith('<a onclick="pdms.ui.save_crop(event)" href="javascript:void(0)">valider</a>');
				
				if (!cropper) pdms.ui.crop();
			} else {
				
				if (cropper2) pdms.ui.setPic(cropper2);
				pdms.ui.clean_webcam();
			}
		},
		save_crop: function(e) {
			
			if (cli.textContent == 'Camera') pdms.ui.setPic(cropper);
			else if (cropper2) pdms.ui.setPic(cropper2);
			
			pdms.ui.clean_webcam();
		},
		clean_webcam: function() {
			
			this.stop_webcam();
			this.destroy_crop();
			this.hide_webcambox();
		},
		stop_webcam: function() {
			
			if (window.stream) {
				
				window.stream.getTracks().forEach(function(track) {
				  track.stop();
				});
				
				delete window.stream;
			}
		},
		destroy_crop: function() {
			
			if (cropper) {
				
				cropper.destroy();
				cropper = null;
			}
		},
		hide_webcambox: function() { box.modal('hide'); },
		play_video: function() { video.play(); },
		setPic: function(c) {
			
			$('#profilePic').attr({src: c.getCroppedCanvas().toDataURL('image/webp')}).
			next('input').val(c.getCroppedCanvas().toDataURL('image/webp'));
		},
		crop: function() {
			
			if (cropper) return;
			
			$(document.body).append('<link rel="stylesheet" type="text/css" href="../../pdms_css/cropper.css"/>');
				
			var croppedWidth = 324;
			var croppedHeight = 324;
			
			cropper = new Cropper(img, {
				viewMode: 3,
				data: {
					width: croppedWidth,
					height: croppedHeight,
				},
		
				crop: function (event) {
					
					var width = event.detail.width;
					var height = event.detail.height;
			
					if (
						width < croppedWidth
						|| height < croppedHeight
						|| width > croppedWidth
						|| height > croppedHeight
					) {
						if (cropper2) cropper2.setData({
						width: croppedWidth,
						height: croppedHeight,
						});
					}
				}
			});
		},
		validateCrop: function() { if (cropper) img.src = cropper.getCroppedCanvas().toDataURL('image/webp'); },
		resetCrop: function() { if (cropper) cropper.reset(); },
		moveCrop: function() { if (cropper) cropper.setDragMode("move"); },
		zoomInCrop: function() { if (cropper) cropper.zoom(0.1); },
		zoomOutCrop: function() { if (cropper) cropper.zoom(-0.1); },
		webcam_box: {
			sel_img: function(e) { $(e.target).next().trigger('click'); },
			load_img: function(e) {
				
				var file = e.target.files[0];
				
				if (!/image\/jpeg|image\/jpg/.test(file.type)) return;
				
				var reader = new FileReader();
				var img = $(e.target).parents('div').children('img')[0];
				
				reader.readAsDataURL(file);
				
				reader.onload = function() {
					
					img.src = reader.result;
					$(img).prev().hide();
					
					$(document.body).append('<link rel="stylesheet" type="text/css" href="../../pdms_css/cropper.css"/>');
						
					var croppedWidth = 324;
					var croppedHeight = 324;
					
					cropper2 = new Cropper(img, {
						viewMode: 3,
						data: {
							width: croppedWidth,
							height: croppedHeight,
						},
				
						crop: function (event) {
							
							var width = event.detail.width;
							var height = event.detail.height;
					
							if (
								width < croppedWidth
								|| height < croppedHeight
								|| width > croppedWidth
								|| height > croppedHeight
							) {
								cropper2.setData({
								width: croppedWidth,
								height: croppedHeight,
								});
							}
						}
					});
					
					var cont = $('.snap-upload');
					
					cont.children().last().css({display: 'block'});
					
					cont.find('.cancel').on('click', function(e) { cropper2.reset(); });
					cont.find('.validate').on('click', function(e) { pdms.ui.setPic(cropper2); });
					cont.find('.move').on('click', function(e) { cropper2.setDragMode("move"); });
					cont.find('.zoom-in').on('click', function(e) { cropper2.zoom(0.1); });
					cont.find('.zoom-out').on('click', function(e) { cropper2.zoom(-0.1); });
				}
			}
		},
		viewer: function(e) {
			e.preventDefault();
			
			var target = e.target;
			
			if (target.nodeName !== 'IMG') return;
			
			bootbox.dialog({
				title: 'Visualiseur image',
				message:'Chargement en cours ...',
				backdrop: false,
				closeButton: false,
				className: 'pdms-viewer-diag',
				size: 'small',
				buttons: {
					ok: {className: 'pf-btn pf-btn-default', callback: null }
				}
			});
			
			$('.pdms-viewer-diag').find('.bootbox-body').html(viewerHTML);
			var img = new Image();
			img.src = target.src;
			$('#viewer').empty().append(img);
		},
		initSelect2: function () {
			var elements = [].slice.call(document.querySelectorAll('[data-control="select2"], [data-select2="true"]'));
	
			elements.map(function (element) {
				var options = {
					dir: document.body.getAttribute('direction'),
					language: 'fr'
				};
	
				if (element.getAttribute('data-hide-search') == 'true') {
					options.minimumResultsForSearch = Infinity;
				}
	
				$(element).select2(options);
			});
		},
		showToast(msg, status) {
			let toastsCnt = document.querySelector('#pdms-toast-container');
	
			if (!toastsCnt) {
				toastsCnt = document.createElement('div');
				toastsCnt.className = 'position-absolute end-0 d-flex flex-column';
				toastsCnt.id = 'pdms-toast-container';
				document.body.appendChild(toastsCnt);
			}
	
			const toast = jQuery(`
			<div class="toast show mb-2" role="alert" aria-live="assertive" aria-atomic="true">
				<div class="toast-header">
					<span class="svg-icon svg-icon-2 svg-icon-primary me-3"><i class="bi bi-${status == 'error' ? 'shield-fill-exclamation text-danger': 'shield-fill-check text-success'}"></i></span>
					<strong class="me-auto ${status == 'error' ? 'text-danger': 'text-success'} fw-bolder">${status == 'error' ? 'Erreur !': 'Félicitation !'}</strong>
					<small></small>
					<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
				</div>
				<div class="toast-body ${status == 'error' ? 'bg-light-danger text-danger': 'bg-light-success text-success'}">${msg}</div>
			</div>
			`);
	
			jQuery(toastsCnt).prepend(toast);
			const t = new Toast(toast.get(0), {
				delay: 300,
				autohide: true,
				animation: true
			});
		}
	};
})(jQuery);
$(function() { pdms.ui.init(); });

pdms.auth = (function($) {
	
	return {
		
		err_log: [],
		ld: function() {
			
			$.ajax({
				url: '../pdms_public/',
				type: 'post',
				dataType: 'html',
				data: { route: 'auth/load' },
				context: $('.wrp > section'),
				success: function(r) { 
					this.html(r); 
					if ($('.check').length) 
						$('.check').each(function(i) { 
								new PDMS().Prettyform.checkBox(this, null); 
							}); 
						}
			});
		},
		validate: function(e, t, r) {
			
			var patters = {
				    name: /^([0-9A-Za-z-\.]+)$/,
					licence: /^([0-9A-Za-z-]+)$/,
					matricule: /^([0-9-]+)$/,
					email: /^(?:[a-zA-Z0-9-\._]+)@(?:[a-zA-Z0-9-_]+)\.(?:(?:[a-zA-Z]{2,3})|(?:[a-zA-Z]{2}\.[a-zA-Z]{1,2}))$/,
					integer: /^(?:\d+)$/,
					float: /^(?:\d*\.\d)$/,
					url: /^((?:http|https:\/\/www\.)?[a-zA-Z0-9\.\S]+(?:\w)*\.[a-zA-Z]{0,3}(?:\/)?)$/
				}, target = e.target, v = target.value;
			
			if (r && v.length === 0) {
				
				this.err_log.push(target);
				$(target).addClass('error').next().addClass('error-icon');
				
				return;
			}
			
			if (t === 'matricule') {
				
				if (v.length >= 10) {
					
					if (/^([0-9]{5})-([0-9]{4})$/.test(v)) {
						
						$(target).removeClass('error').next().removeClass('error-icon');
						
						return;
					} else if (/^([0-9]+)$/.test(v)) {
						
						v = v.substr(0, 5) + '-' + v.substr(5, 4);
						target.value = v;
						
						$(target).removeClass('error').next().removeClass('error-icon');
						
						return;
					} else return;
				}
			}
			
			if (patters[t].test(v)) {
				
				this.err_log.splice(new PDMS().util.in_array(target, this.err_log, true), 1);
				$(target).removeClass('error').next().removeClass('error-icon');
				
				return;
			} else {
				
				this.err_log.push(target);
				$(target).addClass('error').next().addClass('error-icon');
				
				return;
			}
		},
		flic: function(e) {
			
			if (e.keyCode == 45) {
				
				e.preventDefault();
				e.stopPropagation();
				pdms.auth.err_log.push(e.target);
				$(e.target).addClass('error').next().addClass('error-icon');
			}
			
			var target = e.target, v = target.value;
			
			if (v.length === 5 || v.length === 11 || v.length === 17) target.value += '-';
		},
		fmat: function(e) {
			
			var target = e.target, v = target.value;
			
			if (e.keyCode == 45) {
				
				e.preventDefault();
				e.stopPropagation();
				//pdms.auth.err_log.push(target);
				$(target).addClass('error').next().addClass('error-icon');
			}
			
			if (v.length === 5) target.value += '-';
		},
		lic: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			if (this.err_log.length) {
				
				for (i=0; i<this.err_log.length; i++) {
					
					$(this.err_log[i]).addClass('error').next().addClass('error-icon');
				}
				
				this.err_log[0].focus();
				new PDMS().util.shake($('form')[0]);
				
				return;
			}
			
			var frm = $(e.target).parents('form');
			
			$.ajax({
				url: '../pdms_sync/',
				type: 'POST',
				dataType: 'json',
				data: frm.serialize()+'&fn=auth&pn=auth&act=2', 
				context: $(e.target),
				beforeSend: function() { this.attr({disabled: true}); },
				complete: function() { this.removeAttr('disabled'); },
				success: function(r) {
					console.log(r)
					if (r.status) location.reload();
					else {
						
						new PDMS().util.shake(frm[0]);
						$('input[name=licence]').addClass('error').next().addClass('error-icon');
					}
				}
			});
		},
		log: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			if (this.err_log.length) {
				
				for (i=0; i<this.err_log.length; i++) {
					
					$(this.err_log[i]).addClass('error').next().addClass('error-icon');
				}
				
				this.err_log[0].focus();
				new PDMS().util.shake($('form')[0]);
				
				return;
			}
			
			var frm = $(e.target);
			
			$.ajax({
				url: '../pdms_public/',
				type: 'post',
				dataType: 'json',
				data: frm.serialize(),
				context: frm.find('input:submit'),
				beforeSend: function() { this.attr({disabled: true}); },
				complete: function() { this.removeAttr('disabled'); },
				success: function(r) {
					
					if (r.success) {
						pdms.ui.showToast('Compte authentifié !');
						setTimeout(() => {
							location = r.data.url
						}, 200);
					}
					else {
						new PDMS().util.shake(frm[0]);
						pdms.ui.showToast(r.data, 'error');
					}
				}
			});
		},
		off: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			$.ajax({
				url: '../pdms_sync/',
				type: 'POST',
				dataType: 'json',
				data: { fn: 'auth', pn: 'auth', act: 4 },
				context: $(e.target),
				success: function(r) {
					
					if (r.status) location = r.url
				}
			});
		},
		pull: function() {
			
			new EventSource("../pdms_sync/?fn=pull&pn=auth").onmessage = function(event){
				if(!parseInt(event.data) && $(document.body).hasClass('modal-open') == false) {
					bootbox.dialog({
						message: 'Desol&eacute;! Votre session a expir&eacute;.',
						title: '<i class="fa fa-warning"></i> Session expir&eacute;',
						size: 'small',
						closeButton: false,
						className: 'pdms-session-monitor',
						buttons: {
							ok: {label: 'Nouvelle Session', className: 'pf-btn-default', callback: function() {
								location.reload();
							}}
						}
					});
				}
			};
		},
		gen: function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			$.ajax({
				url: '../pdms_sync/',
				type: 'POST',
				dataType: 'json',
				data: { fn: 'com', pn: 'sys', act: 1 },
				context: $(e.target),
				beforeSend: function() { this.attr({disabled: true}); },
				complete: function() { this.removeAttr('disabled'); },
				success: function(r) {
					
					if (r.status) $('input[name=matricule]').val(r.mat.replace('-', ''));
				}
			});
		}
	};
})(jQuery);

(function(){
	window.old_alert = window.alert;
	window.alert = null;
	window.alert = function(message, fallback, callback){
		if(fallback){
			old_alert(message);
			return;
		}
		
		if(callback && typeof callback == "function"){
			bootbox.dialog({
				message: message,
				title: '<i class="fa fa-envelope-o"></i> Message',
				size: 'small',
				backdrop: false,
				closeButton: false,
				buttons: {
					ok: {label: 'Ok', className: 'pf-btn-default', callback: callback}
				}
			});
		} else {
			bootbox.dialog({
				message: message,
				title: '<i class="fa fa-gear"></i> Message',
				size: 'small',
				backdrop: false,
				closeButton: false,
				buttons: {
					ok: {label: 'Ok', className: 'pf-btn-default'}
				}
			});
		}
	};
}());

(function(){
	window.old_confirm = window.confirm;
	window.confirm = null;
	window.confirm = function(message, fallback, callback){
		if(fallback){
			old_confirm(message);
			return;
		}
		
		bootbox.dialog({
			message: message,
			title: '<i class="fa fa-warning"></i> Confirmation',
			size: 'small',
			backdrop: false,
			closeButton: false,
			buttons: {
				ok: {label: 'Oui', className: 'pf-btn-primary', callback: callback},
				cancel: {label: 'Annuler', className: 'pf-btn-default', callback: callback}
			}
		});
	};
}());

(function(){
	window.old_confirm = window.prompt;
	window.prompt = null;
	window.prompt = function(message, fallback, callback){
		if(fallback){
			old_confirm(message);
			return;
		}
		
		bootbox.prompt({
			title: message,
			inputType: 'text',
			size: 'small',
			callback: callback,
			backdrop: false,
			closeButton: false,
			buttons: {
				confirm: {label: 'Comfirmer', className: 'pf-btn-primary', callback: callback},
				cancel: {label: 'Annuler', className: 'pf-btn-default', callback: callback}
			}
		});
	};
}());

export { pdms, PDMS }