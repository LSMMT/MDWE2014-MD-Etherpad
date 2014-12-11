/*
 *
 * Handle client hooks
 *
 */

var debug = true, initHM = true, initDelay=0, lineNumber=-1, initChangeset = new Array(), initDivId = new Array();
var ep_activity = new Array();


// Gets called every second
exports.aceEditEvent = function(hook_name, args, cb) {

  // Pre-init process: save changeset for init process
  /*if (initHM) {
    initChangeset = args.rep.alines;
  }*/

  // Trace Changes after init process
  //else if ((args.callstack.docTextChanged == true || args.callstack.type == "applyChangesToBase")) {
/*
      var changedLine = findChangedLine(args.rep.alines, args.rep.node.id);
      if (changedLine) {
        ep_activity[changedLine][0] = args.rep.alines[changedLine]; // save new changeset
        ep_activity[changedLine][1]++; // increment activity
        if (debug) console.table(ep_activity);
      }*/

      //console.log("aceEditEvent-rep-OBJECT: "+JSON.stringify(args.rep))
      //console.log("aceEditEvent-documentAttributeManager-OBJECT: "+JSON.stringify(args.documentAttributeManager ))
      //console.log("aceEditEvent-callstack -OBJECT: "+JSON.stringify(args.callstack  ))
      //ERROR:createChangeset(args.rep.alines[changedLine]);
  //}

  // Decay of activity
  /*for(var i=0; i<ep_activity.length; i++) {
    if (ep_activity[i][1]>0) {
      var temp_debug = ep_activity[i][1];
      ep_activity[i][1] = Math.max( 0, ep_activity[i][1]-Math.max(0.01, 0.05*ep_activity[i][1]) );
      //console.log("decay: "+temp_debug+" --> "+ep_activity[i][1]);
    }
  }*/

  return cb();
}


// Helper function to find the changed value between two arrays
function findChangedLine(newChangesets, newDivIds) {
  //for(var i=0; i<newDivIds.length; i++) newDivIds[i] = newDivIds[i].substring(10);
  console.log(newDivIds); // new changeset before changes

  for(var i=0; i<newDivIds.length; i++) {

    // regular expression for empty line:  [*x]? |1+1
    //var emptyLine = /^(?:\*[0-9a-z]+)?\|1\+1$/;
/*
    // exception on deleting last (empty) line before filled one (etherpad instantly creates a new one)
    if ( newChangesets[i+1]==undefined && !emptyLine.test(ep_activity[i-1][0]) && !emptyLine.test(newChangesets[i]) ) {
      if (debug) console.log("DELETELAST-exception ("+i+")");
      return false;
    }

    // ChSet-difference found
    else if (newChangesets[i] !== ep_activity[i][0]) {
      console.log("Changeline: "+i);

      // ENTER
      if (emptyLine.test(newChangesets[i]) && newChangesets[i+1] != undefined && ep_activity[i][0]==newChangesets[i+1]) {
        addedLine(i, newChangesets[i]);
        if (debug) console.log("ENTER");
      }
      //if (debug) console.log("ENTER - emptyLine: "+emptyLine.exec(newChangesets[i]));
      //if (debug) console.log("ENTER - next emtpy: "+(newChangesets[i+1]!=undefined?"false":"true"));
      //if (debug) console.log("ENTER - ("+ep_activity[i][0]+") oldChSet -> new_next ("+newChangesets[i+1]+")");
      
      // ENTER-wired Etherpad: prelast filled:ENTER [last always emtpy] -> changeset change in prelast?!
      if ( ep_activity[i+2]==undefined && newChangesets[i+2]!=undefined ) addedLine(i, newChangesets[i]);

      // RETURN
      if ( emptyLine.test(ep_activity[i][0]) && (ep_activity[i+1]==undefined || (ep_activity[i+1]!=undefined && ep_activity[i+1][0]==newChangesets[i]) )  ) {
        droppedLine(i); if (debug) console.log("RETURN");
      }
      //if (debug && ep_activity[i][0]!=undefined) console.log("RETURN - emptyLine: "+emptyLine.exec(ep_activity[i][0]));
      //if (debug) console.log("RETURN - 1) last line: "+(ep_activity[i+1]==undefined?"true":"false")+"           or ...");
      //if (debug && ep_activity[i+1]!=undefined) console.log("RETURN - 2) ("+ep_activity[i+1][0]+") old_next -> thisChSet ("+newChangesets[i]+") : "+(ep_activity[i+1][0]==newChangesets[i]?"true":"false")+"            && (notlast) "+(ep_activity[i+1]!=undefined?"true":"false"));

      // RETURN-MERGE: two filled lines, 2nd line RETURN @ beginning      [note: to be sure add: old+1_count + old_count == new.count [beim count muss jedoch überall auf hinten |1+1 umgerechnet werden -.-]]
      if (ep_activity[i+2]!=undefined && ep_activity[i+1]!=undefined)
        if (ep_activity[i+2][0] == newChangesets[i+1])
          { droppedLine(i); if (debug) console.log("RETURN-MERGE"); }

      return i;
    }*/
  }
}


// Helper function: new line added (ENTER) -> update ep_activity
function addedLine(position, chset, divid) {
  ep_activity.splice(position, 0, new Array(chset, 0, divid)); // splice(index, count_to_remove, addelement1, addelement2, ...)
}


// Helper function: line dropped (RETURN, buggy) -> update ep_activity
function droppedLine(position) {
  ep_activity.splice(position, 1); // splice(index, count_to_remove, addelement1, addelement2, ...)
}


// Helper function for init array process
function createLineArray(line) {
  var lineArray = new Array(null, 0, line); // lineArray[changeset, activity, divid]
  ep_activity.push(lineArray);
}


// Gets called when "pre-init" is done
exports.postAceInit = function(hook_name, args, cb) {
  console.log("postAceInit-event");
  console.log(initDivId); // changeset used for init
  initDelay = lineNumber;

  // Init process: fill ep_activity
  //for (var i=0; i<initChangeset.length; i++) createLineArray(i);
  console.log("Init done: ep_activity now:\n"); console.table(ep_activity);

  initHM=false;
  return cb();
}


// Gets called when DOM line is written -> pre init process
exports.acePostWriteDomLineHTML = function(hook_name, args, cb) {
  var lineContent = args.node.children[0].innerText, lineId = args.node.id.substring(10);

  // Pre init process
  if (initHM) {
    lineNumber++;
    if (debug) console.log("init lineId ("+lineId+") lineNumber("+lineNumber+") lineContent("+(lineContent=="\n"?"\\n":lineContent)+")");
    
    createLineArray(lineId);
  }

  // Pre init process
  else if (initDelay>0) initDelay--;
  else {
    
    // Track changes after init process
    if (ep_activity[i-1]!=undefined && ep_activity[i+1]!=undefined) console.log("change: "+lineId+"          preline: "+ep_activity[i-1][2]+"     nextline:"+ep_activity[i+1][2]);
    console.log("prevSibling: "+args.node.previousSibling.id);
    // ENTER
    //if (ep_activity[i-1][2]==args.node.previousSibling.id)
  }
  return cb();
}