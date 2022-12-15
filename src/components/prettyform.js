/**
 * 
 */
// import { PDMS } from './pdms';

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