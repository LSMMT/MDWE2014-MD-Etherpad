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
     * Hook that gets called on every change-event of ep_activity
     * e.g. to update the mini-/heatmap or to autoscroll of activated
     * //TODO: überarbeite Hook
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
        //TODO: add trigger for changeEvent
        for(var i=0; i<ep_activity.length; i++) {
            if (ep_activity[i][1]>0) {
                var temp_debug = ep_activity[i][1];
                ep_activity[i][1] = Math.max( 0, ep_activity[i][1]-Math.max(0.01, 0.05*ep_activity[i][1]) );
            }
        }
    };

    /**
     * evaluate div-array from editor for changes.
     *
     * @method _evalArray
     * @param {Array} divArray containig all divs from editor
     * @param {Function} callback callback, when evaluation is done
     */
    var _evalArray = function(divArray, callback) {
        if(divArray.length == 0) {
            callback(); // nothing to do here
            return;
        }
        var sanitizedArray = sanitizeArray(divArray);
        //TODO: build new heatmap data
        if(ep_activity.length == sanitizedArray.length) {
            for(var i = 0; i < ep_activity.length; i++) {
                if(ep_activity[i][0] != sanitizedArray[i][0]) {
                    ep_activity[i][0] = sanitizedArray[i][0];
                    ep_activity[i][1] += default_increase_amount;
                }
            }
        } else {
            for(var index = 0; index < sanitizedArray.length; index++) {
                sanitizedArray[index][1] = getOldActivity(sanitizedArray[index][0]);
            } 
            ep_activity = sanitizedArray;
        }
        console.table(ep_activity);
        callback();
    };

    function getOldActivity(id) {
        var old_activity = 1.0;
        ep_activity.forEach(function(element) {
            if(element[0] === id) {
                old_activity = element[1];
            } 
        });
        return old_activity;
    }

    function sanitizeArray(divArray) {
        var tmp = new Array();
        for(var i = 0; i < divArray.length; i++) {
            var element = divArray[i];
            tmp.push([element.id.replace("magicdomid", ""), 1.0]);
        }
        return tmp;
    }


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
        decay : _decay,
        getall : _getall,
        evalArray: _evalArray
    };

}();

module.exports = activity;
