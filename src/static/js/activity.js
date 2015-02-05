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
     *
     * note: if you want to add the functionioality
     * to remove hooks from activity, then the
     * hooks Variable should be changed to a
     * Map, which maps names to functions.
     * After that change it would be possible
     * to change the addHookMethod to
     * addHookMethod(name, function), also
     * add a function name removeHookMethod(name);
     *
     * @type{Array} array containing functions
     *
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
     * last called lineNumber on Heat-event
     * @type {Integer}
     */
    var lastCalledLine = -1;


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
                ep_activity[i][1] = Math.max( 0, ep_activity[i][1]-Math.max(0.01, 0.20*ep_activity[i][1]) );
            }
        }
        checkForHighestTemperature();
    };

    /**
     * iterates over the ep_activity Array and searches
     * for the highest temperature, and scrolls to this
     * line, if it's a different line since the last
     * check.
     * 
     */
    function checkForHighestTemperature() {
        var line = -1;
        var highestTemperature = 0.0;
        ep_activity.forEach(function(element, index) {
            if(element[1] > highestTemperature) {
                line = index + 1; // index starts with 0 lines with 1
                highestTemperature = element[1];
            }
        });
        if(lastCalledLine != line) {
            lastCalledLine = line;
            hooks.forEach(function(element) {
                element(line);
            });    
        }
    }

    /**
     * evaluate div-array from editor for changes.
     *
     * <HOW THIS WORKS>
     * if the array size is the same, we just check every line and look,
     * at the div-id (exp.: 'magicdomidXX'), if the divID is not the same,
     * we take the heat and increase it by default_increase_amount
     *
     * if the array size is not the same, we save the new array and add
     * the old heat values for the line, which still exist
     *
     * -- tip for improvement -- 
     * If you make a new line in for example line 5('magicdomidX'), the magicdomid
     * changes to 'magicdomidX+1', and we don't save the old heat value for this line
     *
     * questions: markus.heider@bindoc.de
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

    /**
     * iterates over the ep_activity to search for,
     * the given id. The id of the line is always saved
     * in the first column of the array
     *
     * @param{Number} id
     * @return {Number} old heat value
     *
     */
    function getOldActivity(id) {
        var old_activity = 1.0;
        ep_activity.forEach(function(element) {
            if(element[0] === id) {
                old_activity = element[1];
            } 
        });
        return old_activity;
    }

    /**
     * takes the given HTML-Div array and returns it
     * in a suiteable form.
     *
     * @param{Array} divArray - HTML Array
     * 
     * @return{Array} [[divID],[heatvalue]]
     * note to heatvalue: we take the default_increase_amount,
     * beacuse we assume, this for a heat event
     */
    function sanitizeArray(divArray) {
        var tmp = new Array();
        for(var i = 0; i < divArray.length; i++) {
            var element = divArray[i];
            tmp.push([element.id.replace("magicdomid", ""), default_increase_amount]);
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

    /**
     * add new function to our callback-array
     *
     * @param{Function} callback - function(lineNumber)
     *
     */
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
