/*
 *
 * Handle client hooks
 *
 */

var debug = true, initHM = true, initDelay=0, lineNumber=-1, initDivId = new Array();
var ep_activity = new Array();


// Gets called when DOM line is written
exports.acePostWriteDomLineHTML = function(hook_name, args, cb) {
  var lineId = args.node.id.substring(10);
  if (debug) console.log("acePostWriteDomLineHTML");

  // Pre init process
  if (initHM) {
    lineNumber++;
  }
  // Init process
  else if (initDelay>0) {
    lineNumber++;
    initDelay--;// 
    createLineArray(lineId);
    if (debug) console.log("init lineId ("+lineId+") lineNumber("+lineNumber+")");
    if (initDelay===0) { console.log("Init done: ep_activity now:\n"); console.table(ep_activity); }
  }
  

  // All DOMline changes after init process -->
  else {
    console.log("changed: lineId("+lineId+")");

    // magic here

  }
  return cb();
}


// Helper function: new line added (ENTER) -> update ep_activity
function addedLine(position, divid) {
  ep_activity.splice(position, 0, new Array(divid, 0));
}


// Helper function: line dropped (RETURN) -> update ep_activity
function droppedLine(position) {
  ep_activity.splice(position, 1); // splice(index, count_to_remove, addelement1, addelement2, ...)
}


// Helper function for init process
function createLineArray(lineId) {
  var lineArray = new Array(lineId, 0); // lineArray[last_divid, activity]
  ep_activity.push(lineArray);
}


// Gets called when "pre-init" is done
exports.postAceInit = function(hook_name, args, cb) {
  if (debug) console.log("postAceInit-event");
  if (debug) console.log("delay: "+lineNumber); // changeset used for init
  initDelay = lineNumber;
  lineNumber = -1;
  initHM=false;
  return cb();
}


// Gets called every second
exports.aceEditEvent = function(hook_name, args, cb) {

    // Decay of activity
    // check if the event is the idleWorkTimer,
    // so we only change the ep_activity table once per second
    
    if (args.callstack.type === "idleWorkTimer") { 
        for(var i=0; i<ep_activity.length; i++) {
            if (ep_activity[i][1]>0) {
                var temp_debug = ep_activity[i][1];
                ep_activity[i][1] = Math.max( 0, ep_activity[i][1]-Math.max(0.01, 0.05*ep_activity[i][1]) );
                //console.log("decay: "+temp_debug+" --> "+ep_activity[i][1]);
            }
        }      
    }

  return cb();
}
