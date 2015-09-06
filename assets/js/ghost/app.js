/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

    //productive

    Samisdat.FauxColumns = (function(){
       var $aside;
       var height = function(){
           var height = $aside.parents('.row').height();
           $aside.height(height); 
       };
       var ready = function(){
           $aside = $('aside.col-md-4');
           if($aside.get(0) === undefined){
               return;
           }
           height();  
       };
       $(document).ready(ready);
    }());

	Samisdat.PositionConway = ( function() {
		var $conway;
		var invisible = false;
		
		var scroll = function(){
			if(invisible === false && $(window).scrollTop() > 250){
				invisible = true;
				$conway.trigger('invisible', {invisible:invisible});
				$conway.addClass('invisible');
			}
			else if(invisible === true && $(window).scrollTop() <= 250){
				invisible = false;
				$conway.trigger('invisible', {invisible:invisible});
				$conway.removeClass('invisible');
			}
		};
		var ready = function() {
			$conway = $('#conway'); 
			$(window).scroll(scroll);
			scroll();
		};

		$(document).ready(ready);
	}());


    //\productive    
    
})(jQuery);