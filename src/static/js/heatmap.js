/**
 * This class manages the heatmap.js library
 *
 * @class heatmap
 */

var heatmap = function() {

  var heatmapInstance;


  // load heatmap
  var _load = function(ep_activity) {

    // init
    heatmapInstance = h337.create({
      container: document.querySelector('.heatmapjs'),
      maxOpacity: .5
    });
    _update(ep_activity);

    // For testing only: add Data
    setInterval(function() { _updateFake(); }, 1000);
  };


  // update heatmap
  var _update = function(ep_activity) {

    var data = generateHMData(ep_activity);
    heatmapInstance.setData(data);
  }


  // update heatmap
  var _updateFake = function() {

    // fake ep_activity
    var ep_activity = new Array();
    var num_lines = 13;
    var max_activity = 100;
    function createLineArray(lineId) {
      var lineArray = new Array(lineId, Math.floor(Math.random()*max_activity) );
      ep_activity.push(lineArray);
    } for (i=0; i<num_lines; i++) createLineArray(i);

    _update(ep_activity);
  }


  // generate heatmap data from ep_activity
  function generateHMData(ep_activity) {
    var points = [], max = 0;
    var width = 200; // px
    var height = 250; // px
    var num_lines = ep_activity.length;
    var height_per_line = height/num_lines;
    document.getElementsByClassName("heatmapjs")[0].style.lineHeight = height_per_line+"px";
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


  return {
    update : _update,
    load : _load
  };

}();

module.exports = heatmap;
