import $Util from "./util";

/**
 * 
 */
var AutoComplete = function(inp, arr1, arr2, callback) {
    this.inp = inp;
    this.arr1 = arr1;
    this.arr2 = arr2;
    this.callback = callback;
}

AutoComplete.prototype = {
    constructor: AutoComplete,
    currentFocus: null,
    max_results: 3,
    init: function() {

        var _this = this;
        
        this.inp.addEventListener('input', function(e) {

            var a, b, i, j, val = this.value;
            
            _this.closeAllLists();
    
            if (!val) {
                return false;
            }
            
            _this.currentFocus = -1;

            a = document.createElement('div');
            this.parentNode.appendChild(a);
            a.classList.add('autocomplete-items');
            a.id = `${this.id}-autocomplete-list`;

            for( let i=0; i<_this.arr1.length; i++) {

                if ( document.querySelectorAll('.autocomplete-items > div').length >= _this.max_results ) {
                    break;
                }
                
                let v = _this.arr1[i];

                j = v.toUpperCase().search(val.toUpperCase());

                if ( j !== -1 ) {
                    b = document.createElement('div');
                    var t = document.createTextNode(v.substring(0, j));
                    var t2 = document.createTextNode(v.substring(j + 1 + val.length - 1));
                    var s = document.createElement('strong');
                    var in1 = document.createElement('input');
                    var in2 = document.createElement('input');

                    b.appendChild(t);
                    b.appendChild(s);
                    b.appendChild(t2);
                    b.appendChild(in1);
                    b.appendChild(in2);
                    a.appendChild(b);

                    s.innerText = v.substr(j, val.length);
                    in1.type = 'hidden';
                    in1.value = v;
                    in2.type = 'hidden';
                    in2.value = _this.arr2 ? _this.arr2[i] : '';

                    b.addEventListener('click', function(e) {
                        const inps = this.querySelectorAll('input');
                        if (_this.callback && typeof _this.callback == 'function') _this.callback(_this.inp, inps[0].value, inps[1].value);
                        _this.closeAllLists();
                    });
                }
            }

            var x = document.getElementById(`${this.id}-autocomplete-list`);

            if (x) {
                x = x.querySelectorAll(':scope > div');
                _this.addActive(x);
            }
            
        });

        this.inp.addEventListener('keydown', function(e) {
            
            var x = document.getElementById(`${this.id}-autocomplete-list`);

            if (x) {
                x = x.querySelectorAll(':scope > div');
            }
            
            if (e.keyCode == 40) {
                _this.currentFocus++;
                _this.addActive(x);
            } else if ( e.keyCode == 38 ) {
                _this.currentFocus--;
                _this.addActive(x);
            } else if ( e.keyCode == 13 ) {

                e.preventDefault();
        
                if (_this.currentFocus > -1) {
                    
                    if (x.length)
                        x[_this.currentFocus].click();
                }
            }
        });
    },
    addActive: function(x) {
        if (x.length === 0) return false;
		
		this.removeActive(x);
		
		if (this.currentFocus >= x.length)
			this.currentFocus = 0;
		if (this.currentFocus < 0)
			this.currentFocus = (x.length - 1);
		
		x[this.currentFocus].classList.add('autocomplete-active');
    },
    removeActive: function(x) {
        x.forEach( c => {
            c.classList.remove('autocomplete-active');
        });
    },
    closeAllLists: function() {
        document.querySelectorAll('.autocomplete-items').forEach(elt => {
			$Util.remove(elt);
		});
    }
}

export default AutoComplete;