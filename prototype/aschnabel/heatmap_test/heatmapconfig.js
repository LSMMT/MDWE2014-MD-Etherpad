
window.onload = function() {

  // pseudo ep_activity
  var ep_activity = new Array();
  var num_lines = 13;
  var max_activity = 100;
  function createLineArray(lineId) {
    var lineArray = new Array(lineId, Math.floor(Math.random()*max_activity) );
    ep_activity.push(lineArray);
  }
  for (i=0; i<num_lines; i++) createLineArray(i);


  // generate heatmap data from ep_activity
  function generateHMData(ep_activity) {
    var points = [], max = 0;
    var width = 200; // px
    var height = 500; // px
    var height_per_line = height/num_lines;
    document.getElementsByClassName("heatmap")[0].style.lineHeight = height_per_line+"px";
    var radius = height_per_line*0.7;

    for (i=0; i<ep_activity.length; i++) {
      var activity = ep_activity[i][1];
      var line = Math.floor((i/ep_activity.length)*height);
      max = Math.max(max, activity);

      for (j=0; j<width; j+=radius/2) {
        var point = {
          x: j,
          y: line,
          value: activity,
          radius: radius
        };
        points.push(point);
      }
    }

    var data = { max: max, data: points };
    return data;
  }

  
  // init + generate Heatmap
  var heatmapInstance = h337.create({
    container: document.querySelector('.heatmap'),
    maxOpacity: .5
  });
  var data = generateHMData(ep_activity);
  heatmapInstance.setData(data);

  // add Data
  setInterval(function(){

    var ep_activity = new Array();
    var num_lines = 13;
    var max_activity = 100;
    function createLineArray(lineId) {
      var lineArray = new Array(lineId, Math.floor(Math.random()*max_activity) );
      ep_activity.push(lineArray);
    }
    for (i=0; i<num_lines; i++) createLineArray(i);

    heatmapInstance.setData(generateHMData(ep_activity));
    console.log("added:"+JSON.stringify(generateHMData(ep_activity)));
  }, 1000);

};