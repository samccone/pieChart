'use strict';
/**
*
* pieChart V.0.6
* by Sam Saccone -- sam@samx.it
*
**/

!(function() {
  if (window.pieChart) {
    alert("window.pieChart namespace already in use");
  } else {
    window.pieChart = function(options) {

      var pixelDensity                = window.devicePixelRatio || 1, // grab the pixel density for retina goodness :)
          element                     = document.createElement('canvas'),
          context                     = element.getContext('2d'),
          radius                      = (options.radius * pixelDensity) || (100 * pixelDensity), // set some defaults
          lineWidth                   = (pixelDensity * options.stroke) || (20 * pixelDensity), // defaults
          startAngle                  = toRad(0),
          endAngle                    = toRad(360),
          registration                = radius + lineWidth / 2,
          fillEndAngle                = toRad(((options.fillPercent / 100 * 360) - 90)),
          complete                    = options.fillPercent >= 100, // make check to make sure if it is over 100% and handle it
          antiAliaisingClippingConts  = 1,
          width                       = registration * 2 + antiAliaisingClippingConts,
          height                      = width,
          backgroundStrokeColors      = typeof options.backgroundStrokeColor === "object" ? options.backgroundStrokeColor : [options.backgroundStrokeColor],
          foregroundStrokeColors      = typeof options.foregroundStrokeColor === "object" ? options.foregroundStrokeColor : [options.foregroundStrokeColor],
          backgroundDrawOptions       = {
                            element: element,
                            complete: complete,
                            endAngle: endAngle,
                            fillEndAngle: fillEndAngle,
                            context: context,
                            registration: registration,
                            animationRate: (options.animationRate || 1000),
                            radius: radius,
                            startAngle: startAngle,
                            lineWidth: lineWidth,
                            clockwise: 1,
                            animationTick: (options.animationTick || function(){}),
                            strokeStyle: backgroundStrokeColors && backgroundStrokeColors[0] || "#000",
                            strokeGradient: backgroundStrokeColors && backgroundStrokeColors[1],
                            width: width,
                            height: height
                          },
          foregroundDrawOptions       = _.extend(_.clone(backgroundDrawOptions), {
                            complete: complete,
                            endAngle: (complete ? endAngle : fillEndAngle),
                            startAngle: (complete ? startAngle : toRad(270)),
                            lineWidth: lineWidth + antiAliaisingClippingConts, // fix for ugly anti aliasing
                            clockwise: 0,
                            strokeStyle: foregroundStrokeColors && foregroundStrokeColors[0] || "#ccc",
                            strokeGradient: foregroundStrokeColors && foregroundStrokeColors[1],
                          });

      function toRad(num) {
        return num * Math.PI/180;
      }

      function parseColor(color) {
        var element, match;

        element = document.createElement('div');
        element.style.color = color;

        document.body.appendChild(element);
        match = /^rgba?\((\d+), ?(\d+), ?(\d+)(, ?(\d+|\d*.\d+))?\)/.exec(getComputedStyle(element).color);
        document.body.removeChild(element);

        return {
          r: match[1],
          g: match[2],
          b: match[3],
          a: match[5] || 255
        };
      }

      function buildGradient(drawOptions) {
        var x      = 0,
            y      = 0,
            i      = 0,
            theta  = 0,
            pixels = drawOptions.gradientContext.createImageData(drawOptions.width, drawOptions.height),
            color  = parseColor(drawOptions.strokeGradient),
            tau    = Math.PI * 2;

        for(; y < drawOptions.height; y++) {
          for(; x < drawOptions.width; x++) {
            theta = Math.atan2(drawOptions.height / 2 - y, x + 1 - drawOptions.width / 2) - tau / 4;
            theta < 0 && (theta += tau);
            pixels.data[i + 0] = color.r;
            pixels.data[i + 1] = color.g;
            pixels.data[i + 2] = color.b;
            pixels.data[i + 3] = (1 - theta / tau) * 255;
            i += 4;
          }
          x = 0;
        }

        return pixels;
      }

      function initializeGradient(drawOptions) {
        if(drawOptions.strokeGradient) {
          drawOptions.gradientElement = document.createElement('canvas');
          drawOptions.gradientContext = drawOptions.gradientElement.getContext('2d');
          drawOptions.gradientElement.setAttribute('width', drawOptions.width + 'px');
          drawOptions.gradientElement.setAttribute('height', drawOptions.height + 'px');
          drawOptions.gradientContext.putImageData(buildGradient(drawOptions), 0, 0);
        }
      }

      element.setAttribute('width', width + 'px');
      element.setAttribute('height', height + 'px');
      element.style.width = width / pixelDensity + 'px';
      element.style.height = height / pixelDensity + 'px';

      initializeGradient(backgroundDrawOptions);
      initializeGradient(foregroundDrawOptions);

      if (foregroundDrawOptions.complete) {
        drawArc(foregroundDrawOptions, 'source-over'); // draws the filled %
        drawArc(backgroundDrawOptions, 'destination-over');
      } else !(function animatedFill(foregroundDrawOptions) {
        foregroundDrawOptions.endAngle = toRad(-90);
        var tween = new TWEEN.Tween( { fillAngle: toRad(-90)} )
            .to( { fillAngle:  (foregroundDrawOptions.complete ? foregroundDrawOptions.endAngle : foregroundDrawOptions.fillEndAngle)}, options.animationRate )
            .easing( TWEEN.Easing.Cubic.InOut )
            .onUpdate(function () {
              foregroundDrawOptions.context.clearRect(0, 0, element.width, element.height);
              foregroundDrawOptions.endAngle = this.fillAngle;
              drawArc(foregroundDrawOptions, 'source-over'); // draws the filled %
              drawArc(backgroundDrawOptions, 'destination-atop'); // draws the background fill;
              foregroundDrawOptions.animationTick(this.fillAngle);
            }).start();
      })(foregroundDrawOptions);

      /**
      * helper function to do the drawing work
      **/
      function drawArc(drawOptions, compositeMode) {
        drawOptions.context.globalCompositeOperation = compositeMode;
        drawOptions.context.strokeStyle  = drawOptions.strokeStyle;
        drawOptions.context.lineWidth    = drawOptions.lineWidth || 1;
        drawOptions.context.beginPath();
        drawOptions.context.arc(drawOptions.registration, drawOptions.registration, drawOptions.radius, drawOptions.startAngle, drawOptions.endAngle, drawOptions.clockwise);
        drawOptions.context.stroke();
        drawOptions.context.closePath();
        drawOptions.context.globalCompositeOperation = 'source-atop';
        drawOptions.strokeGradient && drawOptions.context.drawImage(drawOptions.gradientElement, 0, 0);
      }

      function destroy() {
        TWEEN.removeAll();
        element.parentElement.removeChild(element);
      }

      /**
      * if a container elm was passed then add it to it
      **/
      if (options.container && options.container.appendChild) {
        options.container.appendChild(element);
      } else {
        document.body.appendChild(element);
      }

      !(function animate() {
        requestAnimFrame(animate);
        TWEEN.update();
      })();

      element.destroyChart = destroy;
      return element;
    }
  }
})();