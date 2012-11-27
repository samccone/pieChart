'use strict';
/**
*
* pieChart V.0.5
* by Sam Saccone -- sam@samx.it
*
**/

!(function() {
  if (window.pieChart) {
    alert("window.pieChart namespace already in use");
  } else {
    window.pieChart = function(options) {

      var pixelDensity  = window.devicePixelRatio || 1; //grab the pixel density for retina goodness :)

      var elm                         = document.createElement('canvas'),
          ctx                         = elm.getContext('2d'),
          radius                      = (options.radius * pixelDensity) || (100 * pixelDensity), //set some defaults
          lineWidth                   = (pixelDensity * options.stroke) || (20 * pixelDensity), // defaults
          startAngle                  = 0,
          endAngle                    = 360 * Math.PI/180,
          registration                = radius + lineWidth/2,
          fillEndAngle                = ((options.fillPercent / 100 * 360) - 90) * Math.PI/180,
          complete                    = options.fillPercent >= 100, //make check to make sure if it is over 100% and handle it
          antiAliaisingClippingConts  = 1,
          backgroundDrawOptions       = {
                            element: elm,
                            complete: complete,
                            endAngle: endAngle,
                            fillEndAngle: fillEndAngle,
                            ctx: ctx,
                            registration: registration,
                            animationRate: (options.animationRate || 1000),
                            radius: radius,
                            startAngle: startAngle,
                            lineWidth: lineWidth,
                            clockwise: 1,
                            animationTick: (options.animationTick || function(){}),
                            strokeStyle: options.backgroundStrokeColor || "#000"
                          },
          drawOptions                 = {
                            element: elm,
                            complete: complete,
                            endAngle: (complete ? endAngle : fillEndAngle),
                            fillEndAngle: fillEndAngle,
                            ctx: ctx,
                            registration: registration,
                            animationRate: (options.animationRate || 1000),
                            radius: radius,
                            startAngle: (complete ? startAngle : 270 * Math.PI/180),
                            lineWidth: lineWidth + antiAliaisingClippingConts, // fix for ugly anti aliasing
                            clockwise: 0,
                            animationTick: (options.animationTick || function(){}),
                            strokeStyle: options.foregroundStrokeColor || "#CCC"
                          };
      /**
      * sets the canvas element so that it will fit the desired circle
      **/
      elm.setAttribute('width', registration * 2 + antiAliaisingClippingConts + "px");
      elm.setAttribute('height',registration * 2+ antiAliaisingClippingConts + "px");

      /**
      * enable some retina goodness
      **/
      elm.style.width  =  elm.width/pixelDensity + "px";
      elm.style.height =  elm.width/pixelDensity + "px";

      drawArc(backgroundDrawOptions); // draws the background

      if (drawOptions.complete) {
        drawArc(drawOptions); // draws the filled %
      } else !(function animatedFill(drawOptions) {
        drawOptions.endAngle = -90 * Math.PI/180;
        var tween = new TWEEN.Tween( { fillAngle: -90 * Math.PI/180} )
            .to( { fillAngle:  (drawOptions.complete ? drawOptions.endAngle : drawOptions.fillEndAngle)}, options.animationRate )
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate(function () {
              drawOptions.ctx.clearRect(0, 0, drawOptions.element.width, drawOptions.element.height);
              drawArc(backgroundDrawOptions); // draws the background fill;
              drawOptions.endAngle = this.fillAngle;
              drawArc(drawOptions); // draws the filled %
              drawOptions.animationTick(this.fillAngle);
            }).start();

      })(drawOptions);

      /**
      * helper function to do the drawing work
      **/
      function drawArc(args) {
        args.ctx.strokeStyle  = args.strokeStyle;
        args.ctx.lineWidth    = args.lineWidth || 1;
        args.ctx.beginPath();
        args.ctx.arc(args.registration, args.registration, args.radius, args.startAngle, args.endAngle, args.clockwise);
        args.ctx.stroke();
        args.ctx.closePath();
      }

      /**
      * if a container elm was passed then add it to it
      **/
      if (options.container && options.container.appendChild) {
        options.container.appendChild(elm);
      } else {
        document.body.appendChild(elm);
      }

      !(function animate() {
        requestAnimFrame(animate);
        TWEEN.update();
      })();

      return elm;
    }
  }

  // shim layer with setTimeout fallback
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  // tween.js - http://github.com/sole/tween.js
  var TWEEN=TWEEN||function(){var a=[];return{REVISION:"7",getAll:function(){return a},removeAll:function(){a=[]},add:function(c){a.push(c)},remove:function(c){c=a.indexOf(c);-1!==c&&a.splice(c,1)},update:function(c){if(0===a.length)return!1;for(var b=0,d=a.length,c=void 0!==c?c:Date.now();b<d;)a[b].update(c)?b++:(a.splice(b,1),d--);return!0}}}();
  TWEEN.Tween=function(a){var c={},b={},d=1E3,e=0,f=null,h=TWEEN.Easing.Linear.None,r=TWEEN.Interpolation.Linear,k=[],l=null,m=!1,n=null,p=null;this.to=function(a,c){void 0!==c&&(d=c);b=a;return this};this.start=function(d){TWEEN.add(this);m=!1;f=void 0!==d?d:Date.now();f+=e;for(var g in b)if(null!==a[g]){if(b[g]instanceof Array){if(0===b[g].length)continue;b[g]=[a[g]].concat(b[g])}c[g]=a[g]}return this};this.stop=function(){TWEEN.remove(this);return this};this.delay=function(a){e=a;return this};this.easing=
  function(a){h=a;return this};this.interpolation=function(a){r=a;return this};this.chain=function(){k=arguments;return this};this.onStart=function(a){l=a;return this};this.onUpdate=function(a){n=a;return this};this.onComplete=function(a){p=a;return this};this.update=function(e){if(e<f)return!0;!1===m&&(null!==l&&l.call(a),m=!0);var g=(e-f)/d,g=1<g?1:g,i=h(g),j;for(j in c){var s=c[j],q=b[j];a[j]=q instanceof Array?r(q,i):s+(q-s)*i}null!==n&&n.call(a,i);if(1==g){null!==p&&p.call(a);g=0;for(i=k.length;g<
  i;g++)k[g].start(e);return!1}return!0}};
  TWEEN.Easing={Linear:{None:function(a){return a}},Quadratic:{In:function(a){return a*a},Out:function(a){return a*(2-a)},InOut:function(a){return 1>(a*=2)?0.5*a*a:-0.5*(--a*(a-2)-1)}},Cubic:{In:function(a){return a*a*a},Out:function(a){return--a*a*a+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*a:0.5*((a-=2)*a*a+2)}},Quartic:{In:function(a){return a*a*a*a},Out:function(a){return 1- --a*a*a*a},InOut:function(a){return 1>(a*=2)?0.5*a*a*a*a:-0.5*((a-=2)*a*a*a-2)}},Quintic:{In:function(a){return a*a*a*
  a*a},Out:function(a){return--a*a*a*a*a+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*a*a*a:0.5*((a-=2)*a*a*a*a+2)}},Sinusoidal:{In:function(a){return 1-Math.cos(a*Math.PI/2)},Out:function(a){return Math.sin(a*Math.PI/2)},InOut:function(a){return 0.5*(1-Math.cos(Math.PI*a))}},Exponential:{In:function(a){return 0===a?0:Math.pow(1024,a-1)},Out:function(a){return 1===a?1:1-Math.pow(2,-10*a)},InOut:function(a){return 0===a?0:1===a?1:1>(a*=2)?0.5*Math.pow(1024,a-1):0.5*(-Math.pow(2,-10*(a-1))+2)}},Circular:{In:function(a){return 1-
  Math.sqrt(1-a*a)},Out:function(a){return Math.sqrt(1- --a*a)},InOut:function(a){return 1>(a*=2)?-0.5*(Math.sqrt(1-a*a)-1):0.5*(Math.sqrt(1-(a-=2)*a)+1)}},Elastic:{In:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return-(b*Math.pow(2,10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4))},Out:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return b*Math.pow(2,-10*a)*Math.sin((a-c)*
  2*Math.PI/0.4)+1},InOut:function(a){var c,b=0.1;if(0===a)return 0;if(1===a)return 1;!b||1>b?(b=1,c=0.1):c=0.4*Math.asin(1/b)/(2*Math.PI);return 1>(a*=2)?-0.5*b*Math.pow(2,10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4):0.5*b*Math.pow(2,-10*(a-=1))*Math.sin((a-c)*2*Math.PI/0.4)+1}},Back:{In:function(a){return a*a*(2.70158*a-1.70158)},Out:function(a){return--a*a*(2.70158*a+1.70158)+1},InOut:function(a){return 1>(a*=2)?0.5*a*a*(3.5949095*a-2.5949095):0.5*((a-=2)*a*(3.5949095*a+2.5949095)+2)}},Bounce:{In:function(a){return 1-
  TWEEN.Easing.Bounce.Out(1-a)},Out:function(a){return a<1/2.75?7.5625*a*a:a<2/2.75?7.5625*(a-=1.5/2.75)*a+0.75:a<2.5/2.75?7.5625*(a-=2.25/2.75)*a+0.9375:7.5625*(a-=2.625/2.75)*a+0.984375},InOut:function(a){return 0.5>a?0.5*TWEEN.Easing.Bounce.In(2*a):0.5*TWEEN.Easing.Bounce.Out(2*a-1)+0.5}}};
  TWEEN.Interpolation={Linear:function(a,c){var b=a.length-1,d=b*c,e=Math.floor(d),f=TWEEN.Interpolation.Utils.Linear;return 0>c?f(a[0],a[1],d):1<c?f(a[b],a[b-1],b-d):f(a[e],a[e+1>b?b:e+1],d-e)},Bezier:function(a,c){var b=0,d=a.length-1,e=Math.pow,f=TWEEN.Interpolation.Utils.Bernstein,h;for(h=0;h<=d;h++)b+=e(1-c,d-h)*e(c,h)*a[h]*f(d,h);return b},CatmullRom:function(a,c){var b=a.length-1,d=b*c,e=Math.floor(d),f=TWEEN.Interpolation.Utils.CatmullRom;return a[0]===a[b]?(0>c&&(e=Math.floor(d=b*(1+c))),f(a[(e-
  1+b)%b],a[e],a[(e+1)%b],a[(e+2)%b],d-e)):0>c?a[0]-(f(a[0],a[0],a[1],a[1],-d)-a[0]):1<c?a[b]-(f(a[b],a[b],a[b-1],a[b-1],d-b)-a[b]):f(a[e?e-1:0],a[e],a[b<e+1?b:e+1],a[b<e+2?b:e+2],d-e)},Utils:{Linear:function(a,c,b){return(c-a)*b+a},Bernstein:function(a,c){var b=TWEEN.Interpolation.Utils.Factorial;return b(a)/b(c)/b(a-c)},Factorial:function(){var a=[1];return function(c){var b=1,d;if(a[c])return a[c];for(d=c;1<d;d--)b*=d;return a[c]=b}}(),CatmullRom:function(a,c,b,d,e){var a=0.5*(b-a),d=0.5*(d-c),f=
  e*e;return(2*c-2*b+a+d)*e*f+(-3*c+3*b-2*a-d)*f+a*e+c}}};
})();