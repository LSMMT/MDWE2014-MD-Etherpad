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
     * @type {[[Number]]}
     */
    var ep_activity = new Array();

    /**
     * containing all callbacks,
     * called when heat on one line is big enough
     */
    var hooks = new Array();

    /**
     * default settings
     *
     * @property settings
     * @type {Object}
     */
    var default_increase_amount = 1;    // default amount for increasing activity


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
                ep_activity[i][1] = Math.max( 0, ep_activity[i][1]-Math.max(0.01, 0.20*ep_activity[i][1]) );
            }
        }
        checkForHighestTemperature();
    };

    function checkForHighestTemperature() {
        var line = -1;
        var highestTemperature = 0.0;
        //console.log("-----------------------------------------");
        ep_activity.forEach(function(element, index) {
            //console.log(index + " - " + element[1]);
            if(element[1] > highestTemperature) {
                line = index;
            }
        });
        hooks.forEach(function(element) {
            element(line);
        });
    }
<<<<<<< HEAD

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
        if(ep_activity.length == sanitizedArray.length) {
            for(var i = 0; i < ep_activity.length; i++) {
                if(ep_activity[i][0] != sanitizedArray[i][0]) {
                    ep_activity[i][0] = sanitizedArray[i][0];
                    ep_activity[i][1] = ep_activity[i][1] + default_increase_amount;
                }
            }
        } else {
            for(var index = 0; index < sanitizedArray.length; index++) {
                sanitizedArray[index][1] = getOldActivity(sanitizedArray[index][0]);
            } 
            ep_activity = sanitizedArray;
        }
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

    var _register = function(callback) {
        console.log("REGISTER NEW HOOK");
        hooks.push(callback) ;
    };


    return {
        decay : _decay,
        getall : _getall,
        evalArray: _evalArray,
        register: _register
    };

}();

module.exports = activity;
