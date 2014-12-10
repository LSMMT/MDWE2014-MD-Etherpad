/*
 *
 * Handle client hooks
 *
 */

var debug = true, initHM = false, initDelay=0, lineNumber=-1, initChangeset = new Array();
var ep_activity = new Array();


// Gets called every second
exports.aceEditEvent = function(hook_name, args, cb) {
  // Decay of activity
  for(var i=0; i<ep_activity.length; i++) {
    if (ep_activity[i][1]>0) {
      var temp_debug = ep_activity[i][1];
      ep_activity[i][1] = Math.max( 0, ep_activity[i][1]-Math.max(0.01, 0.05*ep_activity[i][1]) );
      //console.log("decay: "+temp_debug+" --> "+ep_activity[i][1]);
    }
  }

  // Gets called when changeset received
  if ((args.callstack.docTextChanged == true || args.callstack.type == "applyChangesToBase")) {
    if (args.rep.selEnd) {
      // Preinit EditEvent - used to determin first change after init
      if (!(initDelay<0)) initChangeset = args.rep.alines;
      else {
        // Trace activity after init process
        var changedLine = findChangedLine(args.rep.alines);
        ep_activity[changedLine][0] = args.rep.alines[changedLine]; // save new changeset
        ep_activity[changedLine][1]++; // increment activity
        console.table(ep_activity);

        //console.log("aceEditEvent-rep-OBJECT: "+JSON.stringify(args.rep))
        //console.log("aceEditEvent-documentAttributeManager-OBJECT: "+JSON.stringify(args.documentAttributeManager ))
        //console.log("aceEditEvent-callstack -OBJECT: "+JSON.stringify(args.callstack  ))
        //ERROR:createChangeset(args.rep.alines[changedLine]);
      }
    }
  }
  return cb();
};

// Helper function to find the changed value between two arrays
function findChangedLine(newChangesets) {
  console.log(newChangesets); // new changeset before changes
  for(var i=0; i<newChangesets.length; i++) {
    // Exception when ep_activity[i] doesnt exist yet (last line)
    if (ep_activity[i] == undefined) { console.log("not found"); createLineArrayCS(i, "|1+1"); }

    if (newChangesets[i] !== ep_activity[i][0]) {
      // debugging / logging
      console.log("Changeline ("+i+"): "+ep_activity[i][0]+" --> "+newChangesets[i]);
      if (ep_activity[i-1] != undefined && newChangesets[i-1] != undefined) console.log("(preLine) "+ep_activity[i-1][0]+" --> "+newChangesets[i-1]);
      if (ep_activity[i+1] != undefined && newChangesets[i+1] != undefined) console.log("(nextLine) "+ep_activity[i+1][0]+" --> "+newChangesets[i+1]);

      // notice ENTER & RETURN [  +- [*x]? |1+1 ]
      var re0 = /^(?:\*[0-9a-z]+)?\|1\+1$/;
      if (re0.test(newChangesets[i])) { addedLine(i, newChangesets[i]); console.log("found: "+re0.exec(newChangesets[i])); } // ENTER button
      else if (re0.test(ep_activity[i][0])) droppedLine(i); // RETURN button

      return i;
    }
  }
}

// Helper function: new line added (ENTER) -> update ep_activity
function addedLine(position, chset) {
  ep_activity.splice(position, 0, new Array(chset, 0)); // splice(index, count_to_remove, addelement1, addelement2, ...)
}

// Helper function: line dropped (RETURN, buggy) -> update ep_activity
function droppedLine(position) {
  ep_activity.splice(position, 1); // splice(index, count_to_remove, addelement1, addelement2, ...)
}


// Gets called when DOM line is written -> for Init process
exports.acePostWriteDomLineHTML = function(hook_name, args, cb) {
  var lineContent = args.node.children[0].innerText,
      lineId = args.node.id.substring(10);

  // Create array containing padlines
  if (initHM) {
    lineNumber++;
    console.log("init lineId ("+lineId+") lineNumber("+lineNumber+") lineContent("+(lineContent=="\n"?"\\n":lineContent)+")");
    createLineArray(lineNumber);
    initDelay--;
    if (initDelay<1) { initHM=false; initDelay--; console.log("Init done: ep_activity[line][changeset, activity] \n"); console.table(ep_activity); }
  }

  // Count initDelay
  else if (initDelay>=0) initDelay++;
  return cb();
};



// Helper function for init array process
function createLineArray(line) {
  var lineArray = new Array(initChangeset[line], 0); // lineArray[changeset, activity]
  ep_activity.push(lineArray);
};


// Gets called when init process can start
exports.postAceInit = function(hook_name, args, cb) {
  //initDelay--;
  console.log("postAceInit-event");
  console.log("start Init - initDelay("+initDelay+")");
  initHM = true;
  // generateHeatmap ( createNumericModel(ep_activity) )
  return cb();
};