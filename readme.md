<h2> This Is PieChart </h2>
<p> after seeing a deluge of charts in this style I decided to make a plugin to ease your development of them</p>
<img src="http://dribbble.s3.amazonaws.com/users/23390/screenshots/802936/pie-charts.png" width="50px">
<img src="http://dribbble.s3.amazonaws.com/users/7387/screenshots/688739/piechart.jpg"  width="50px">
<h4> how to use </h4>
<pre>
  <code>
      <script type="text/javascript" src="pieChart.js"></script>
      <script type="text/javascript">
        pieChart({
          fillPercent: 50,
          radius: 90,
          stroke: 40,
          backgroundStrokeColor: "teal",
          foregroundStrokeColor: "orange",
          container: document.getElementById('im_a_div')
        });
      </script>
  </code>
</pre>