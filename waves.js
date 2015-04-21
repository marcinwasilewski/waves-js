(function() {

	var animate, w, h, pi, color, secondaryColor, redraw, move, mx, my, my2, lineWidth, waves;

	animate=true;
	w = window.innerWidth;
	h = window.innerHeight;
	pi = 0.5*Math.PI;
	color = '255,255,255';
	secondaryColor = '0,0%,0%';
	redraw=true;
	move = true;
	mx=0,my=0,my2=0;
	lineWidth = 2;
	mouse_moved = 0;
	waves = [
		{
			x : 0,
			amplitude : 0,
			range : 5,
			wavelength : 45,
			phase : 20,
			space : -1, 
			count : 0,
			maxamp : 70,
		},
		{
			x : 2,
			amplitude : 0,
			range :25,
			wavelength : 5,
			phase : 45,
			space : -1.4, 
			count : 0,
			maxamp : 5,
		},
		{
			x : 10,
			amplitude : 0,
			range : 10,
			wavelength : 85,
			phase : 86,
			space : 1, 
			count : 0,
			maxamp : 90,
		},
			 
		
		

		{
			x : 20,
			amplitude : 0,
			range :10,
			wavelength : 20,
			phase : 100,
			space : 1, 
			count : 0,
			maxamp : 85,
		},
		{
			x : 30,
			amplitude : 0,
			range :5,
			wavelength : 40,
			phase : 35,
			space : 2, 
			count : 0,
			maxamp : 90,
		},
		{
			x : 39,
			amplitude : 0,
			range : 5,
			wavelength : 15,
			phase : 95,
			space : 1, 
			count : 0,
			maxamp : 24,
		},
		{ 
			x : 40,
			range : 12,
			amplitude : 0,
			wavelength : 100,
			phase : 140,
			space : -3,
			count : 0,
			maxamp:120,
			minamp:4,
		 },
		 { 
			x : 53,
			range : 9,
			amplitude : 0,
			wavelength : 90,
			phase : 70,
			space : 0.4,
			count : 0,
			maxamp:120,
		},
		{ 
			x : 59,
			range : 7,
			amplitude : 0,
			wavelength : 2,
			phase : 3,
			space : 2,
			count : 0,
			maxamp:20,
		},

		{ 
			x : 60,
			range : 7,
			amplitude : 0,
			wavelength : 12,
			phase : 0,
			space : -3,
			count : 0,
			maxamp:59,
		},
		{ 
			x :70,
			range : 20,
			amplitude : 0,
			wavelength : 300,
			phase : 30,
			space :20,
			count : 0,
			maxamp:30,
		},	 	
		{
			x : 74,
			amplitude : 0,
			range : 15,
			wavelength : 26,
			phase : 95,
			space : -1, 
			count : 0,
			maxamp : 61,
		},
		{
			x : 90,
			range : 5,
			amplitude : 0,
			wavelength : 10,
			phase : 0,
			space : 1,
			momuseSpace : 2,
			count : 0,
			maxamp:20,
		 },
		{
			x : 92,
			amplitude : 0,
			range : 5,
			wavelength : 25,
			phase : 95,
			space : -1, 
			count : 0,
			maxamp : 61,
		},
		 
	];

	$(function() {

		// create canvas
		
		canvas = document.getElementById('canvas'),
		context = canvas.getContext('2d');
		
		// resize the canvas to fill browser window dynamically
		
		window.addEventListener('resize', resizeCanvas, false);

		function resizeCanvas() {
				w = window.innerWidth;
				h = window.innerHeight;
				canvas.width = w;
				canvas.height = h;
				redraw=true;
		}
		
		resizeCanvas();
		
		drawStuff();
		
		updateColor();
		
		// drawing function
			
		function drawStuff() {
			if(redraw && animate) {
			
				// clear canvas
					
				canvas.width=canvas.width;

				/* waves on the sides */
				
				grd=context.createRadialGradient(w/2,h/2,250,w/2,h/2,w/2);
				grd.addColorStop(0,'rgba('+color+',0)');
				grd.addColorStop(1,'rgba('+color+',0.4)');
				context.strokeStyle=grd;
				for (j = 0; j < waves.length; ++j) {
					context.beginPath();
					
					if(waves[j].amplitude>0) {
						for(i=0;i<w;i++) {

							inc = (pi * (w/waves[j].wavelength)) / (w);
							rads = (waves[j].count - i) * inc + waves[j].phase;
							_newamp =  waves[j].amplitude  * (1-Math.abs((i/w)-.5)*2);
							context.lineTo(i, (h/2)+Math.sin(rads)*_newamp);				
							}
					}
					context.stroke();		
				}	
			
				// superposition of the waves in the center
				
				context.lineWidth=lineWidth;				
				context.moveTo(w/2-240, (h/2));			
				context.beginPath();	
				for(i=w/2-360;i<w/2+340;i++) {	
					finaltdy=0;
					for (j = 0; j < waves.length; ++j) {
						inc = (pi * (w/waves[j].wavelength)) / (w);
						rads = (waves[j].count - i) * inc + waves[j].phase;
						tdy = Math.sin(rads)*waves[j].amplitude;
						finaltdy+=tdy;	
							
					}
					
					// mouse attraction? for the future 
					
					attract = 25;
					
					mdx = i - mx;
					mdy = (h/2)+finaltdy - my;
						
					distance = Math.sqrt(Math.pow(mdx, 2)+Math.pow(mdy, 2));
					addtdx= -(mdx * attract) / distance;
					addtdy= -(mdy * attract) / distance;
					
					context.lineTo(i, (h/2)+finaltdy);
				}
				
				grd=context.createRadialGradient(w/2,h/2,0,w/2,h/2,260);
				grd.addColorStop(0,'hsla('+secondaryColor+',1)');
				grd.addColorStop(1,'hsla('+secondaryColor+',0)');
				context.strokeStyle=grd;
			
				if(finaltdy!=0) context.stroke();		
			}
			
			// finished redrawing this frame
			
			redraw = false;
			
			requestAnimationFrame(drawStuff);
		}
		
		function getMousePos(e) {
			return {
			  x: parseInt(e.clientX),
			  y: parseInt(e.clientY)
			};
		}
		
		// calculate changes in amplitudes of waves with regard to mouse pos
				
		function recalculateWaves() {			
			for (j = 0; j < waves.length; ++j) {
				
				// calculate distance from maximum amplitude point for that wave
				
				mp = mx/w;
				
				dist =  Math.abs(mp*100-waves[j].x);
				
				// if we are within this wave's range, let the "attenuation" be a function of distance and maximum range
				
				if(dist<waves[j].range) {
					waves[j].amplitude = waves[j].maxamp - dist/waves[j].range*waves[j].maxamp;
				}
				else waves[j].amplitude = 0; 
			}
		}
		
		// advance waves every X ms
		
		setInterval(
			function() {
			recalculateWaves();
				if(move) 
					advance();
			},80); 

		// advance waves forward/backward
		
		function advance() {
			for (j = 0; j < waves.length; ++j) {
				waves[j].count+= waves[j].space;
			}	
			recalculateWaves();
			redraw=true;
		}
		
		function backwards(mult) {
			for (j = 0; j < waves.length; ++j) {
				waves[j].count+= mult*waves[j].space;
				
			}	
			recalculateWaves();
			redraw=true;
		}
		
		// colors change on their own or depending on mouse position
		
		function updateColor() {
			if(mouse_moved==0) {
				my2++;
				if(my2>360) my=0;
				secondaryColor = my2+",50%,50%";
				$('#skills strong').css('color','hsl('+my2+","+15+"%,50%"+')');
				$('.myname').css('color','hsl('+my2+","+10+"%,50%"+')');
				$('h2 .myname').css('text-shadow','0 0 2px hsl('+my2+","+40+"%,50%"+')');
				window.setTimeout(updateColor,150);
			}
			else {
				var $width = w/100;
				var $height = h/100;
				var $pageX = parseInt(mx / $width,10);
				var $pageY = parseInt((my / $height) - (mx / $width),36);	
				secondaryColor = $pageY+","+$pageX+"%,50%";
				$('#skills strong').css('color','hsl('+$pageY+","+15+"%,50%"+')');
				$('.myname').css('color','hsl('+$pageY+","+10+"%,50%"+')');
				$('h2 .myname').css('text-shadow','0 0 2px hsl('+$pageY+","+40+"%,50%"+')');
			}
			
		}
		
		$(document).scroll(function(){
			advance();
			redraw=true;
		});
		
		$(document).mousemove(function(e) {
			mouse_moved=1;
			p = getMousePos(e);
			mx = p.x;
			my = p.y;	
			redraw=true;
			updateColor(p);
			backwards(0.5);
		});
		
		
		
	});

}());
