/*
            __   __                       __          ___       __                      ___ ___ 
 |\/|  /\  |__) /  ` | |\ |    |  |  /\  /__` | |    |__  |  | /__` |__/ |        |\ | |__   |  
 |  | /~~\ |  \ \__, | | \|    |/\| /~~\ .__/ | |___ |___ |/\| .__/ |  \ |    .   | \| |___  |  
*/

// requestAnimationFrame polyfill

var lastTime = 0;
var vendors = ['webkit', 'moz'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };

function Waves(canvas, options) {

	this.waves = [];
	this.animate=true;
	this.w = window.innerWidth;
	this.h = window.innerHeight;
	this.pi = 0.5*Math.PI;
	this.color = '255,255,255';
	this.secondaryColor = '120,50%,50%';
	this.thirdColor = '50,50%,50%';
	this.hue = 0;
	this.redraw=true;
	this.move = true;
	this.mx=(this.w/105)*Math.floor(Math.random()*100+5);
	this.mx_offset = 0;
	this.my=1;
	this.my2=0;
	this.lineWidth = 2;
	this.mouseMoved = 0;
	this.waitTime = 500; // time before auto X-axis movement sets in
	this.canvas = document.getElementById(canvas);
	this.setCanvas = function(canvas){if(canvas!=this.canvas) { this.canvas = canvas;this.resizeCanvas(); }};
	this.timeout = null;
	this.mouseMoved = 0;
	this.globalSpeed = 0.2;
	this.advanceInterval = 1000/50;
	this.debug = false;
	this.offsetY = 0;
	this.mode = 1;
	this.mouse = true;

	if(typeof(options.debug)!="undefined") this.debug = options.debug;
	this.colorClassName = "";
	if(typeof(options.colorClassName)!="undefined") this.colorClassName = options.colorClassName;
	this.bgColorClassName = "";
	if(typeof(options.bgColorClassName)!="undefined") this.bgColorClassName = options.bgColorClassName;
	this.lighterColorClassName = "";
	if(typeof(options.lighterColorClassName)!="undefined") this.lighterColorClassName = options.lighterColorClassName;
	this.shadowClassName = "";
	if(typeof(options.shadowClassName)!="undefined") this.shadowClassName = options.shadowClassName;


	function Wave(options) {

		if(typeof(options) == "undefined") options = {};

		// optionable variables
		this.x = 0;
		if(typeof(options.x) != "undefined") this.x = options.x;

		this.amplitude = 0;
		if(typeof(options.amplitude) != "undefined") this.amplitude = options.amplitude;

		this.range = 1;
		if(typeof(options.range) != "undefined") this.range = options.range;

		this.wavelength = 1;
		if(typeof(options.wavelength) != "undefined") this.wavelength = options.wavelength;

		this.phase = 0;
		if(typeof(options.phase) != "undefined") this.phase = options.phase;

		this.space = 1;
		if(typeof(options.space) != "undefined") this.space = options.space;

		this.maxamp = 0;
		if(typeof(options.maxamp) != "undefined") this.maxamp = options.maxamp;

		// non-options variables 
		this.count = 0;

		this.update = function(object) {
			var mx = object.mx+object.mx_offset;
			if(mx>object.w) mx = mx-object.w;

			var mp = mx/object.w;
			var dist =  Math.abs(mp*100-this.x);
			
			if(dist<this.range) {

				this.amplitude = this.maxamp - dist/this.range*this.maxamp;

			}
			else this.amplitude = 0; 
		};

	}

	this.addWave = function(options) {
		this.waves.push(new Wave(options));
	};

	this.addWaves = function(arr) {
		for (var i = arr.length - 1; i >= 0; i--) {
			this.addWave(arr[i]);
		};
	};

	this.updateWaves = function() {		
		for (var i = this.waves.length - 1; i >= 0; i--) {
			this.waves[i].update(this);
		};
	};



	this.updateColors = function() {
		var width = this.w/50;
		var height = this.h/50;
		var pageX = parseInt(this.mx / width,10);

		this.hue = ((this.my / height) + (this.mx / width))*3.6;
		this.hue=Math.round(this.hue+this.my2);
		if(this.hue>360) this.hue-=360;
		
		this.secondaryColor = this.hue+","+50+"%,50%";
		this.thirdColor = this.hue+","+15+"%,50%";		

		if(this.colorClassName!="") {

			var arr = document.getElementsByClassName(this.colorClassName);
			for (var i = arr.length - 1; i >= 0; i--) {
				
				arr[i].style.color="hsla("+this.secondaryColor+",1)";
				
			};

			var arr = document.getElementsByClassName(this.bgColorClassName);
			for (var i = arr.length - 1; i >= 0; i--) {
				
				arr[i].style.backgroundColor="hsl("+this.hue+",10%,60%)";
				console.log(this.bgColorClassName);
				
			};

			var arr = document.getElementsByClassName(this.shadowClassName);
			for (var i = arr.length - 1; i >= 0; i--) {
				
				arr[i].style.textShadow="0px 0px 4px hsla("+this.thirdColor+",1)";
				
			};

			var arr = document.getElementsByClassName(this.lighterColorClassName);
			for (var i = arr.length - 1; i >= 0; i--) {
				
				arr[i].style.color="hsla("+this.thirdColor+",1)";
				
			};
			
		}
	};

	this.colorTime = function() {
		this.my2++;
		if(this.my2>360) this.my2=0;

		// this functions needs to run periodically

		window.setTimeout(this.colorTime.bind(this),100);
		
		// if mouse wasn't moved in the last 2 seconds,
		// "animate" moving it along X axis so that waves change
		// @TODO more fluency 

		if(this.mouseMoved==0) {
			this.mx_offset+=this.w/1000*0.55;
			if(this.mx_offset>=this.w) this.mx_offset=this.mx_offset-this.w;
			this.updateWaves();
		}

					
		this.updateColors();
		
	};

	this.onMouseMove = function(e) {
		if(!this.isVisible()) return false;
		if(!this.mouse) return false;

		this.mx = e.clientX;
		this.my = e.clientY;
		if(this.isVisible()) {
			this.updateWaves();

		}
		this.updateColors();
		this.redraw = true;
		this.mouseMoved=1;
		clearTimeout(this.timeout);
		if(this.waitTime>0) this.timeout = setTimeout(function(){this.mouseMoved=0}.bind(this), this.waitTime);
	};


	this.drawWaves = function() {
		var ctx = this.canvas.getContext('2d');
		var grd=ctx.createRadialGradient(this.w/2,this.h/2+this.offsetY,280,this.w/2,this.h/2+this.offsetY,this.w/2);
		grd.addColorStop(0,'hsla('+this.thirdColor+',0)');
		grd.addColorStop(1,'hsla('+this.thirdColor+',1)');
		ctx.strokeStyle=grd;
		//ctx.strokeStyle="white";
		ctx.lineWidth = this.lineWidth;	
		for (var j = this.waves.length - 1; j >= 0; j--) {
			ctx.beginPath();
			if(this.waves[j].amplitude>0) {

				for(var i=0;i<this.w;i++) {
					if(i>this.w/2-260 && i<this.w/2+260) {
						//ctx.stroke();ctx.beginPath();
						continue;
					}
					var inc = (this.pi * (this.w/this.waves[j].wavelength)) / (this.w);
					var rads = (this.waves[j].count - i) * inc + this.waves[j].phase;
					var _newamp =  this.waves[j].amplitude  * (1-Math.abs((i/this.w)-.5)*2);
					ctx.lineTo(i, 0.5+(this.h/2)+Math.sin(rads)*_newamp+this.offsetY);				
					}
			}
			ctx.stroke();		
		}			
	};

	this.drawBg = function(color) {
		var context = this.canvas.getContext('2d');

			
			
			if(color=="white") {
				
				
				grd=context.createRadialGradient(this.w/2,this.h/2+this.offsetY,100,this.w/2,this.h/2+this.offsetY,this.h/2);	
				grd.addColorStop(0,'hsla('+this.thirdColor+',0.3)');
				grd.addColorStop(0.5,'hsla('+this.thirdColor+',0)');
				context.strokeStyle=grd;
			}
			else {
				//grd.addColorStop(1,'rgba(255,255,255,0.1)');
				grd=context.createRadialGradient(this.w/2,this.h/2+this.offsetY,370,this.w/2,this.h/2+this.offsetY,this.w/2);	
				grd.addColorStop(0,'hsla('+this.thirdColor+',0)');
				grd.addColorStop(0.5,'hsla('+this.thirdColor+',1)');
				context.strokeStyle=grd;
			}

		
		context.lineWidth = 1	;
		context.beginPath();	

		for(i=0;i<this.w;i++) {	
			var finaltdy=0;

			/*if(i>this.w/2-100 && i<this.w/2+100) {
				context.stroke();context.beginPath();
				continue;
			}*/

			for (var j = this.waves.length - 1; j >= 0; j--) {

				var rads = (i) * (this.waves[j].wavelength);
				var tdy = Math.sin(rads)*this.waves[j].amplitude* (1-Math.abs((i/this.w)-.5)*2)*3;
				finaltdy+=tdy;	
					
			}
						
			context.lineTo(i, (this.h/2)+finaltdy+this.offsetY);
		}
	
		context.stroke();
	};

	this.drawAmplitudeModulation = function() {
		// superposition of the waves in the center
		var context = this.canvas.getContext('2d');
		//context.lineWidth=lineWidth;			
		
		grd=context.createRadialGradient(this.w/2,this.h/2,0,this.w/2,this.h/2,260);
		grd.addColorStop(0,'hsla('+this.secondaryColor+',1)');
		grd.addColorStop(1,'hsla('+this.secondaryColor+',0)');
		context.strokeStyle=grd;
		context.lineWidth = this.lineWidth;
		context.moveTo(this.w/2-240, (this.h/2));			
		context.beginPath();	
		for(var i=0;i<this.w;i++) {
			var finaltdy=0;

			for (var j = this.waves.length - 1; j >= 0; j--) {

				var inc = (this.pi * (this.w/this.waves[j].wavelength)) / (this.w);
				var rads = (this.waves[j].count - i) * inc + this.waves[j].phase;
				var tdy = Math.sin(rads)*this.waves[j].amplitude;
				finaltdy+=tdy;	
					
			}
			
			context.lineTo(i, (this.h/2)+finaltdy+this.offsetY);
		}
	
		if(finaltdy!=0) context.stroke();
	};

	this.isVisible = function() {
		//return true;
		var bodyRect = document.body.getBoundingClientRect();
		var elemRect = this.canvas.getBoundingClientRect();
		var  offset   = elemRect.top - bodyRect.top;
		var top  = window.pageYOffset || document.documentElement.scrollTop;
		if((top>=offset && top<=offset+this.canvas.height) || (top+this.h>=offset && top+this.h<=offset+this.canvas.height)) return true;
		return false;
	};

	this.draw = function() {
		if(this.redraw && this.animate && this.isVisible()) {
			this.canvas.width = this.canvas.width; // clear canvas
			var ctx = this.canvas.getContext('2d');
			if(this.mode==1) {
				this.drawBg("white");
				this.drawAmplitudeModulation();		
				//this.drawBg();
			}
			else if(this.mode==2 && this.w>800) {
				this.drawWaves();
				this.drawBg();

			}
			else if(this.mode==3) {
				this.drawBg("white");
				this.drawWaves();
				this.drawAmplitudeModulation();		
			}
			this.redraw=false;
		}
		requestAnimationFrame(this.draw.bind(this));
	}

	if(typeof(options.waves) != "undefined") {
		this.addWaves(options.waves);		
	}

	this.resizeCanvas = function() {
		this.w = window.innerWidth;
		this.h = window.innerHeight;
		this.canvas.width = this.w;
		this.canvas.height = this.h;

		if(this.w<500) this.offsetY=-Math.floor(this.h*0.1)+0.5;
		else this.offsetY = 0;

		this.redraw=true;
	}

	this.advance = function(multiplier) {
		if(!this.isVisible()) return false;
		for (var i = this.waves.length - 1; i >= 0; i--) {
			var add = this.waves[i].space*this.globalSpeed;
			if(typeof(multiplier)!="undefined")
				add = add*multiplier;
			this.waves[i].count+= add;

		}	
		this.redraw=true;
	};

	this.updateDebug = function() {

		if(this.debug) {
			var debug = document.getElementsByClassName("debug");
			
			if(debug.length) debug[0].parentNode.removeChild(debug[0]);

			debug = document.createElement("div");
			debug.className="debug";
			document.body.appendChild(debug);

			var colorDiv = document.createElement("div");
			colorDiv.innerText = "thirdColor: "+this.thirdColor;
			debug.appendChild(colorDiv);

			var mouseDiv = document.createElement("div");
			mouseDiv.innerText = "Mx: "+this.mx.toPrecision(4)+", my: "+this.my.toPrecision(4);
			debug.appendChild(mouseDiv);

			for (var i = this.waves.length - 1; i >= 0; i--) {
				var waveDiv = document.createElement("div");
				var tmp = this.waves[i];
				waveDiv.innerText = tmp.x+": - "+tmp.amplitude.toPrecision(3)+" +";
				debug.appendChild(waveDiv);
			};

		};	
	};

	// bind stuff
	window.onmousemove = this.onMouseMove.bind(this);
	window.addEventListener('resize', this.resizeCanvas.bind(this), false);
	window.setInterval(this.advance.bind(this), this.advanceInterval);
	if(this.debug) window.setInterval(this.updateDebug.bind(this), 30);

	this.resizeCanvas();
	this.draw();
	this.colorTime();
	this.updateDebug();
}
