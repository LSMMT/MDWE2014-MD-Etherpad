/**
 *
 * Handle client hooks: acePostWriteDomLineHTML
 *
 */

var debug = true;
var activity = require('./activity');


/**
 * variables used for init process only
 * @property initialized
 * @type {Boolean}
 * @default false
 */
 var initialized = false, initDelay=0, initlineNumber=-1;


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
      if (debug) console.log("init lineDivId ("+lineDivId+") initlineNumber("+initlineNumber+")");
      if (initDelay===0) { console.log("Init done: ep_activity=\n"); console.table(activity.getall()); }
    }


    /*
     * Check for paste or delete
     * commented to merge it afterwards
     //TODO: merge
     */
    /*
    var divArr = getDivArray();
    

    if (divArr.length < olddivs) {
        var diffLength = olddivs.length - divArr.length;
        for (var i = divArr.length ; i < olddivs.length; i++) {
            delete olddivs[i];
        }
    } else if(divArr.length > olddivs.length) {
        var diffLength = divArr.length - olddivs.length;
        for (var i = olddivs.length; i < divArr.length; i++) {
            var tmp = [];
            tmp[0] = -1;
            tmp[1] = 0.0;
            olddivs[i] = tmp;
        }
    }

    for (var i = 0; i < divArr.length; i++) {
        var oldid = olddivs[i][0];
        var newid = divArr[i].id.replace("magicdomid", "");
        if (oldid != newid) {
            console.log("oldid-"+oldid+" newid-"+newid);
            olddivs[i][0] = newid;
            olddivs[i][1] += 1.5;

            console.table(olddivs);
        }
    }
     */

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
}


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