/*
 *
 * Handle client hooks: acePostWriteDomLineHTML
 *
 */
var debug = true, initHM = true, pastInitDelay, HMlines = new Array(); // use jquery for multidim.arrays I guess?
 
 
exports.acePostWriteDomLineHTML = function(hook_name, args, cb) {		
  //console.log("acePostWriteDomLineHTML => node: "+args.node.id);
  
  // while HMinit-process create array
  if (initHM) {
    console.log("init line: "+args.node.id.substring(10));
    HMlines[args.node.id.substring(10)-1] = 0;
  }
  
  // after init only checkout changes
  else if (pastInitDelay>0) pastInitDelay--;
  else  {
    console.log("<-- (obj) change in DIV not line ("+args.node.id.substring(10)+")!      changeset ala: Z:20y>1|5=6c*0+1$g");
  }
  
  return cb();
};


exports.postAceInit = function(hook_name, args, cb) {		
  //console.log("postAceInit-event"); // wieso kommen die aPW-Events beim Laden doppelt? vor/nach pAI
  
  console.log("Init done - HMlines("+HMlines.length+"): "+JSON.stringify(HMlines));
  initHM = false; // init done
  pastInitDelay = HMlines.length-1; // -1 wieso auch immer ... (aPW-Events beim Laden doppelt)
  
  createNumericModel(); // from array
  // generate first heatmap
  
  return cb();
};


/*
exports.aceStartLineAndCharForPoint = function (hook_name, args, cb) {	
  //console.log("aceStartLineAndCharForPoint-event");
  // mist - aceStartLineAndCharForPoint-Event zeigt nur die akt. Pointer-Position an!
  //console.log("rep: "+JSON.stringify(args.rep.selStart)+" to "+JSON.stringify(args.rep.selEnd));
  
  return cb();
};*/