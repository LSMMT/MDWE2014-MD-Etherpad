/*
 *
 * Handle client hooks: acePostWriteDomLineHTML
 *
 */
var debug = true, initHM = true, pastInitDelay, HMlines = new Array(); // use jquery for multidim.arrays I guess?
var ep_content = new Array();

/**
 * acePostWriteDomLineHtml hook
 * called after the dom of the ace editor has been changed

 * @param {string} hook_name the name of the hook
 * @param {object} args context of the hook - for more information: http://etherpad.org/doc/v1.4.1/
 * @param {function} cb the callback
 *
 * @return {function} return of the cb
 */
exports.acePostWriteDomLineHTML = function(hook_name, args, cb) {
    //console.log("acePostWriteDomLineHTML => node: "+args.node.id);
    var lineContent = 0,
        lineNumber = 0;
    // while HMinit-process create array
    if (initHM) {
        console.log("init line: "+args.node.id.substring(10)-1);
        lineContent = args.node.children[0].innerText;
        lineNumber = args.node.id.substring(10)-1;
        pushStringToArray(lineContent, lineNumber);
        HMlines[args.node.id.substring(10)-1] = 0;
    }

    // after init only checkout changes
    else if (pastInitDelay>0) {
        pastInitDelay--;
    }
    else  {
        console.log("<-- (obj) change in DIV not line ("+args.node.id.substring(10)+")!      changeset ala: Z:20y>1|5=6c*0+1$g");
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


exports.postAceInit = function(hook_name, args, cb) {
  //console.log("postAceInit-event"); // wieso kommen die aPW-Events beim Laden doppelt? vor/nach pAI

  console.log("Init done - HMlines("+HMlines.length+"): "+JSON.stringify(HMlines));
  initHM = false; // init done
  pastInitDelay = HMlines.length-1; // -1 wieso auch immer ... (aPW-Events beim Laden doppelt)

  createNumericModel(); // from array
  // generate first heatmap

  return cb();
};

exports.aceEditEvent = function(hook_name, args, cb) {
  if (args.callstack.docTextChanged == true) {
    if (args.rep.selEnd) {
      console.log("Änderung in Line "+args.rep.selEnd);
      console.log(args.rep.selEnd[0]);
      console.log("Changeset "+args.rep.alines[args.rep.selEnd[0]]);

      createChangeset(args.rep.alines[args.rep.selEnd[0]]);
    }
  }
  return cb();
};


function pushStringToArray(content, line) {
  var lineArray = content.split('');
  lineArray.unshift(line);
  ep_content.push(lineArray);
};


/*
exports.aceStartLineAndCharForPoint = function (hook_name, args, cb) {
  //console.log("aceStartLineAndCharForPoint-event");
  // mist - aceStartLineAndCharForPoint-Event zeigt nur die akt. Pointer-Position an!
  //console.log("rep: "+JSON.stringify(args.rep.selStart)+" to "+JSON.stringify(args.rep.selEnd));

  return cb();
};*/



/**
 * This function returns an array containing every div object of the pad-document
 *
 * @return {Array} the div objects
 */
function getDivArray() {
    return document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].contentDocument.getElementById("innerdocbody").children;
}

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



