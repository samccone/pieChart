<a href="http://samccone.github.com/pieChart/"> -- Demo -- </a>
<h2> This Is PieChart </h2>
PieChart is a simple way to make beautiful donught style pie charts. It has the options for gradient fills and animations.
<p> after seeing a deluge of charts in this style I decided to make a plugin to ease your development of them</p>
<img src="http://dribbble.s3.amazonaws.com/users/23390/screenshots/802936/pie-charts.png" width="50px">
<img src="http://dribbble.s3.amazonaws.com/users/7387/screenshots/688739/piechart.jpg"  width="50px">
<h4> how to use </h4>
<pre>
  <code>
      pieChart({
        fillPercent: 95,
        backgroundStrokeColor: "blue", //optional
        foregroundStrokeColor: "green", //optional
        animationRate: 5, //optional
        animationTick: function(angle) { console.log("currently at "+angle)}, //optional
        radius: 120, //optional
        stroke: 12, //optional
        container: document.getElementById('ff') //optional
      });
  </code>
</pre>
<img src="http://dl.dropbox.com/u/47552986/Screenshots/y.png" width="312px" height="190px">
