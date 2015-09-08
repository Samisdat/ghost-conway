/*jslint browser: true, white: true, vars: true */
/*global jQuery, Samisdat */
(function($) {

    "use strict";

    //productive

	Samisdat.Conway.Canvas = ( function() {
			var animation_paused = false;
		
			var $canvas;

			var canvas = {
				ctx : undefined,
				width : 0,
				height : 0,
			};

			var offset = {
				x : 0,
				y : 0
			};

			var cell = {
				width : 8,
				spacing : 0
			};

			var visibile = {
				rows : undefined,
				collums : undefined
			};
			
			var sidebar = {
				offsetLeft:undefined,
				width:undefined
			};

			var render = function() {
				
				var population_pos = {
					top: Math.floor(visibile.rows / 2),
					left: Math.floor(visibile.collums / 2)
				};
				
				canvas.ctx.fillStyle = '#c5cf9c';
				canvas.ctx.fillRect(0, 0, canvas.width, canvas.height);

				// darken sidebar a little
				canvas.ctx.fillStyle = '#d1d9b0';
				canvas.ctx.fillRect(sidebar.offsetLeft, 0, sidebar.width, canvas.height);

				for (var row = 0; row < visibile.rows; row += 1) {
					for (var column = 0; column < visibile.collums; column += 1) {

						var color = '#ffffff';
																		
						var _cell = Samisdat.Conway.Population.get_cell( 
							( row - population_pos.top ),
							( column - population_pos.left )
						);
						
						if(_cell === undefined || _cell.live() === false){
							if( (column - population_pos.left) === 0 ){
								color = '#ff0000';
								
							}
							else{
								continue;	
							}
							
						}
						
						if(_cell !== undefined && _cell.live() === true){
							color = '#8c9568';
						}
						
						canvas.ctx.fillStyle = color;
						canvas.ctx.fillRect((offset.x + (column) * (cell.width + cell.spacing) ), (offset.y + (row) * (cell.width + cell.spacing) ), cell.width, cell.width);
					}
				}
			};
			var last_hash = '';
			var something_to_render = function(){
				var hash = {
					generation:Samisdat.Conway.Generation.get()
				};

				hash = JSON.stringify(hash);
				
				if(hash === last_hash){
					console.log('nothing changed');
					return false;
				}
				
				hash = last_hash;
				return true;				
			};
			var loop = function() {
				var animate = something_to_render();
				if(animate === true){
					render();				
				}
				
				if(animation_paused === true){
					return;
				}

				requestAnimationFrame(loop);
			};

			$('#conway').on('invisible', function(evt, data){
				if(data.invisible === undefined){
					return;
				}
				
				if(data.invisible === true){
					animation_paused = true;
					return;
				}
				else if(data.invisible === false){
					animation_paused = false;
					loop();
					return;
				}				
			});


			/**
			 * Everything dealing with width/height in a function
			 */
			var prepare_observation = function() {
				canvas.width = $canvas.width();
				canvas.height = $canvas.height();

				// canvas is getting blury when these stunts are left
				$canvas.find('canvas').css({
					width : canvas.width + 'px',
					height : canvas.height + 'px'
				});
				canvas.ctx.canvas.width = canvas.width;
				canvas.ctx.canvas.height = canvas.height;
				canvas.ctx.width = canvas.width;
				canvas.ctx.height = canvas.height;

				// how many rows/col can be shown in given space
				visibile.rows = Math.floor((canvas.height - cell.spacing) / (cell.width + cell.spacing));
				visibile.collums = Math.floor((canvas.width - cell.spacing) / (cell.width + cell.spacing));

				// add two so we get cutted cells on all sides
				visibile.rows += 2;
				visibile.collums += 2;

				offset.x = canvas.width - (visibile.collums * (cell.width + cell.spacing) + cell.spacing);
				offset.x = Math.floor(offset.x / 2);

				offset.y = canvas.height - (visibile.rows * (cell.width + cell.spacing) + cell.spacing);
				offset.y = Math.floor(offset.y / 2);
			};

			var setup_canvas = function() {
				$canvas = $('div#conway');
				if ($canvas.get(0) === undefined) {
					return false;
				}

				canvas.ctx = $canvas.find('canvas').get(0).getContext("2d");

				if (!canvas.ctx) {
					return false;
				}

				canvas.ctx.fillStyle = '#000000';
				canvas.ctx.strokeStyle = '#000000';
				canvas.ctx.lineWidth = 1;

			};

			var get_sidebar = function(){
				sidebar.offsetLeft = $('header h1 a').offset().left;
				sidebar.width = $('header h1 a').width() + parseInt($('header h1 a').css('padding-left'), 10) + parseInt($('header h1 a').css('padding-right'), 10);
			};

			var ready = function() {
				get_sidebar();
				$(window).resize(get_sidebar);

				setup_canvas();
				prepare_observation();

				loop();
			};

			$(document).ready(ready);
		}());


    //\productive    
    
})(jQuery);