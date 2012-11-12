/**
*
* pieChart V.0.2
* by Sam Saccone -- sam@samx.it
*
**/

!(function() {
  if (window.pieChart) {
    alert("window.pieChart namespace already in use");
  } else {
    window.pieChart = function(options) {
      var elm           = document.createElement('canvas'),
          ctx           = elm.getContext('2d'),
          radius        = options.radius || 100,
          lineWidth     = options.stroke || 20,
          startAngle    = 0 * Math.PI/180,
          endAngle      = 360 * Math.PI/180,
          registration  = radius + lineWidth/2
          fillEndAngle  = ((options.fillPercent / 100 * 360) - 90) * Math.PI/180,
          complete      = options.fillPercent == 100,
          drawOptions   = {
                            ctx: ctx,
                            registration: registration,
                            radius: radius,
                            startAngle: startAngle,
                            endAngle: endAngle,
                            lineWidth: lineWidth,
                            clockwise: 1,
                            strokeStyle: options.backgroundStrokeColor || "#000"
                          };

      /**
      * sets the canvas element so that it will fit the desired circle
      **/
      elm.setAttribute('width', registration * 2 + "px");
      elm.setAttribute('height', registration * 2+ "px");

      drawArc(drawOptions); // draws the background

      drawOptions.startAngle  = complete ? startAngle : 270 * Math.PI/180;
      drawOptions.endAngle    = complete ? endAngle : fillEndAngle;
      drawOptions.clockwise   = 0;
      drawOptions.strokeStyle = options.foregroundStrokeColor || "#CCC";
      drawOptions.lineWidth   = lineWidth + 1; // fix for ugly anti aliasing

      drawArc(drawOptions); // draws the filled %

      function drawArc(args) {
        args.ctx.strokeStyle  = args.strokeStyle;
        args.ctx.lineWidth    = args.lineWidth || 1;
        args.ctx.beginPath();
        args.ctx.arc(args.registration, args.registration, args.radius, args.startAngle, args.endAngle, args.clockwise);
        args.ctx.stroke();
        args.ctx.closePath();
      }

      if(options.container && options.container.appendChild) {
        options.container.appendChild(elm);
      } else {
        document.body.appendChild(elm);
      }
      return elm;
    }
  }
})();