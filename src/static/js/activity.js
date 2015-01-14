/**
 * This class manages the activity information of all text-lines of the pad
 *
 * @class activity
 */

 var panel = require('./panel');

var activity = function() {

  var debug = true;

  /**
   * This array contains all text-lines of the pad with their current activity
   * structure:
   *    key => [ divid, activity ]
   *    ... with key = linenumber-1
   *
   * }
   *
   * @property ep_activity
   * @type {Array}
   */
  var ep_activity = new Array();

  /**
   * default settings
   *
   * @property settings
   * @type {Object}
   */
  var default_increase_amount = 1;    // default amount for increasing activity


  /**
   * To increment the activity of a specific line
   *
   * @method _increment
   * @param {Integer} linenumber
   * @param {Double} amount [amount=default_increase_amount]
   */
  var _increment = function(linenumber, amount) {
    amount = (typeof amount === "undefined") ? default_increase_amount : amount;

    // do something smart stuff
    changeEvent(linenumber);
  };


  /**
   * To add lines to ep_activity
   *
   * @method _addline
   * @param {Integer} after_line
   * @param {Integer} first_divid
   * @param {Integer} amount [amount=1]
   */
  var _addline = function(after_line, first_divid, amount) {
    amount = (typeof amount === "undefined") ? 1 : amount;

    for (var i=0; i<amount; i++)
      ep_activity.splice(after_line-1+i, 0, new Array(parseInt(first_divid)+i, 0));

    changeEvent(after_line, amount); // added position = (after_line-1)+1
  };


  /**
   * To remove lines from ep_activity
   *
   * @method _removeline
   * @param {Integer} start_line
   * @param {Integer} amount [amount=1]
   */
  var _removeline = function(start_line, amount) {
    amount = (typeof amount === "undefined") ? 1 : amount;

    ep_activity.splice(start_line-1, amount);

    changeEvent(start_line-2, 2); // handle remove as activity in previous (-1 -> -2) & next line
  };


  /**
   * Hook that gets called on every change-event of ep_activity
   * e.g. to update the mini-/heatmap or to autoscroll of activated
   *
   * @method changeEvent
   * @param {Integer} start_line
   * @param {Integer} amount [amount=1]
   */
  var changeEvent = function(start_line, amount) {
    amount = (typeof amount === "undefined") ? 1 : amount;
    // panel.setHeatmapContent();

    if (debug) console.log("->activity.changeEvent("+start_line+", "+amount+")");
    //TODO: update minimap
    //TODO: decide/do autoscroll
    //TODO: update heatmap
    /**
    * heatmap.update(activity.getall()); // scope problem
    * if no other solution: instead of passive changeEvent() active _changeEvent(ep_activity) from outside
    */
  };


  /**
   * Decay of activity - gets called once per second from aceEditEvent
   * decrements all activity-values > 0 of max(0.01, 5%)
   *
   * @method _decay
   */
  var _decay = function() {
    for(var i=0; i<ep_activity.length; i++) {
        if (ep_activity[i][1]>0) {
          var temp_debug = ep_activity[i][1];
          ep_activity[i][1] = Math.max( 0, ep_activity[i][1]-Math.max(0.01, 0.05*ep_activity[i][1]) );
        }
    }
  };


  /**
   * returns copy of ep_activity array
   * so it's not possible to directly change the epactivity
   * outside the module
   *
   * @method _getall
   */
  var _getall = function() {
      return ep_activity.slice();
  };


  return {
    increment : _increment,
    addline : _addline,
    removeline : _removeline,
    decay : _decay,
    getall : _getall
  };

}();

module.exports = activity;
