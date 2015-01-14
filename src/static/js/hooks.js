/**
 *
 * Handle client hooks: acePostWriteDomLineHTML
 *
 */

var debug = true;
var panel = require('./panel');
var activity = require('./activity');
var heatmap = require('./heatmap');
// var panel = require('./panel');


/**
 * variables used for init process only
 * @property initialized
 * @type {Boolean}
 * @default false
 */
 var initialized = false, initDelay=0, initlineNumber=-1;


exports.documentReady = function(hook_name, args, cb) {
  // panel.init();
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
    var lineDivId = args.node.id.substring(10);
    if (!initialized) initlineNumber++;// Pre init process
    else if (initDelay>0) {
      initlineNumber++;
      initDelay--;
      activity.addline(initlineNumber+1, lineDivId);
      //console.log("init lineDivId ("+lineDivId+") initlineNumber("+initlineNumber+")");
      if (initDelay===0) {
        console.log("Init done: ep_activity=\n");
        console.table(activity.getall());
        //TODO: load minimap
        heatmap.load(activity.getall());
        // [works but not nice for other devs doing their work]
      }
    } else {
        // after init process
        var newArray = getDivArray();
        var oldArray = activity.getall();
        console.log(oldArray);
        var sanitizedArray = new Array();
        for(var i = 0; i < newArray.length; i++) {
            var element = newArray[i];
            var magicdomid = parseInt(element.id.replace("magicdomid", ""));
            sanitizedArray.push([magicdomid, 0]);
        }
        diffArrays(oldArray, sanitizedArray);
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

  if (args.callstack.type === "idleWorkTimer")
    activity.decay();

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

function diffArrays(old, newA) {
    oldMini = new Array();
    newMini = new Array();

    newA.forEach(function(element) {
        newMini.push(element[0]);
    });

    old.forEach(function(element) {
        oldMini.push(element[0]) ;
    });

    if(oldMini.length > newMini.length) {
        var changedLines = new Array();
        for(var index = 0; index < newMini.length; index++) {
            var oldVal = oldMini[index];
            var newVal = newMini[index];
            if(oldVal != newVal) { // changed
                var tmp = oldMini.indexOf(newVal);
                changedLines.push([index, tmp]);
            }
        }
        changedLines.forEach(function(element) {
            activity.removeline(element[0], (element[1] - element[0])); 
        });
        
    } else if(oldMini.length < newMini.length) {
        var changedLines = new Array();
        for(var index = 0; index < oldMini.length; index++) {
            var oldVal = oldMini[index];
            var newVal = newMini[index];
            if(oldVal != newVal) { // changed
                var tmp = newMini.indexOf(oldVal);
                changedLines.push([index, tmp]);
            }
        }
        changedLines.forEach(function(element) {
            activity.addline(element[0], newA[element[0]][0], (element[1] - element[0]));
        });
    } else { // nothing happened
        return ;
    }
   
};
