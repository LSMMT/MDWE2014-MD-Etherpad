/**
 *
 * Handle client hooks: acePostWriteDomLineHTML
 *
 */

var debug = true;
var panel = require('./panel');
var activity = require('./activity');
var heatmap = require('./heatmap');
var minimap = require('./minimap.min');
// var panel = require('./panel');


/**
 * variables used for init process only
 * @property initialized
 * @type {Boolean}
 * @default false
 */
var initialized = false, initDelay=0, initlineNumber=-1;


exports.documentReady = function(hook_name, args, cb) {
    // $('#showHeatmapButton').click(function() {
    //   panel.openPanel();

    // });
    panel.init();
    panel.buildPanel();
    $('#showHeatmapButton').click(function() {
        panel.openPanel();
    });

    $('.heatmap').click(function(e) {
        var target = $(e.target),
            lineNumber;
        if ( target.is( "span" ) ) {
            // get clicked line number
            lineNumber = parseInt(target.parent()[0].id.substring(10));
            panel.scrollToLine(lineNumber);
        }
    });

    return cb();
};

/**
 * postAceInit Hook
 * called after the AceEditor has been initialized
 *
 * @param {String} hook_name the name of the hook
 * @param {Object} args context of the hook - for more information: http://etherpad.org/doc/v1.4.1/
 * @param {Function} cb the callback
 *
 * @return {Function} return of the cb
 */
exports.postAceInit = function(hook_name, args, cb) {

    /**
     * Init process
     */
    if (debug) console.log("postAceInit-event");
    if (debug) console.log("delay: "+initlineNumber); // changeset used for init
    initDelay = initlineNumber;
    initlineNumber = -1;
    initialized=true;
    panel.init();

    // for debug purposes
    activity.register(function(lineNumber) {
        panel.scrollToLine(lineNumber);
    });

    setInterval(function() {
        activity.decay();
    }, 1000);
    setInterval(function() {
        var divArray = getDivArray();
        activity.evalArray(divArray, function() {

        });
    }, 500);

    return cb();
};


/**
 * acePostWriteDomLineHtml hook
 * called after the dom of the ace editor has been changed
 *
 * @param {string} hook_name the name of the hook
 * @param {object} args context of the hook - for more information: http://etherpad.org/doc/v1.4.1/
 * @param {function} cb the callback
 *
 * @return {function} return of the cb
 */
exports.acePostWriteDomLineHTML = function(hook_name, args, cb) {

    /**
     * Init process
     */
    if (!initialized) initlineNumber++;// Pre init process
    else if (initDelay>0) {
        initlineNumber++;
        initDelay--;
        if (initDelay===0) {
            //TODO: load minimap
            heatmap.load(activity.getall());
            // [works but not nice for other devs doing their work]
        }
    }

    return cb();
};


/**
 * aceEditEvent hook
 * called every second and after the dom of the ace editor has been changed
 *
 * @param {string} hook_name the name of the hook
 * @param {object} args context of the hook - for more information: http://etherpad.org/doc/v1.4.1/
 * @param {function} cb the callback
 *
 * @return {function} return of the cb
 */
exports.aceEditEvent = function(hook_name, args, cb) {

    // Decay of activity
    // check if the event is the idleWorkTimer,
    // so we only change the ep_activity table once per second

    return cb();
};


/**
 * This function returns an array containing every div object of the pad-document
 *
 * @return {Array} the div objects
 */
function getDivArray() {
    return document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].contentDocument.getElementById("innerdocbody").children;
};


/**
 * reduces the given magicdomid {String} (exp.: magicdomid42)
 * and returns only the number of the id
 *
 * @param {String} magicdomid
 *
 * @return {Int} id as String
 */
function reduceMagicDomId(magicdomid) {
    var tmpStr = magicdomid.replace("magicdomid", "");

    return parseInt(tmpStr);
};
