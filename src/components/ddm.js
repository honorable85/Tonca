const ddm =  function(element) {
    element.querySelectorAll('li').forEach(function(elt, i) {
        
        if (elt.getElementsByTagName('ul').item(0)) {
            
            elt.list = elt.getElementsByTagName('ul').item(0);
            elt.list.is_opened = false;
        }
    });
    
    var curr_opened_menus = [];
    
    element.addEventListener('mouseover', function(e) {
        if (!e) e = window.event;
        
        for (var target = e.target; target.nodeName !== 'LI'; target = target.parentNode);
        
        buildMenu(target);
        
        if (target.list && target.list.is_opened === false) {
            
            target.classList.add('highlite');
            target.list.classList.add('slidedown');
            target.list.is_opened = true;
            curr_opened_menus.push(target.list);
        }
    }, false);
    
    element.addEventListener('mouseout', function(e) { buildMenu(e.relatedTarget); }, false);
    
    function buildMenu(target) {
        
        var curr_branch = [];
        
        curr_opened_menus.forEach(function(menu, i) {
            
            if (menu.contains(target)) {
                
                curr_branch.push(menu);
            } else {
                
                menu.parentNode.classList.remove('highlite');
                menu.is_opened = false;
                menu.classList.remove('slidedown');
            }
        });
        
        curr_opened_menus = curr_branch;
    }
}

export default ddm;