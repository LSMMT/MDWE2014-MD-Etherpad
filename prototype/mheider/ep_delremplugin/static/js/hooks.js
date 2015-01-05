/**
 * hooks.js
 * Contains the client hook of the ep_delremplugin etherpad-lite plugin
 *
 * @author Markus Heider <markus.heider@tu-dresden.de>
 */

 
/**
 * 2D Array containing abstraction of the DOM-Lines
 * (a DOM-Line contains the last magicdomid of the line and the ep_activity value)
 * 
 * @property olddivs
 * @type {Array}
 */
var olddivs;

/**
 * flag to remember if the plugin has been initialized yet
 * @property initialized
 * @type {Boolean}
 * @default false
 */
 var initialized = false;



/**
 * This function returns an array containing every div object of the pad-document
 *
 * @return {Array} the div objects
 */
function getDivArray() {
    return document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].contentDocument.getElementById("innerdocbody").children;
}

/*
 *
 */
function initializeLineArray() {
    if (initialized != true) {
        olddivs = new Array();
        getIdsOfDivs();
    }
};

function getIdsOfDivs() {
    var divArr = getDivArray();

    // initilization
    for (var i = 0; i < divArr.length; i++) {
        var mgdi = divArr[i].id.replace("magicdomid", "");
        var tmpArr = [];
        tmpArr[0] = mgdi;
        tmpArr[1] = 0.0;
        olddivs[i] = tmpArr;
    }
    initialized = true;
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
    /*
     * initialize everything 
     */
    initializeLineArray();
    return cb();
};


/**
 * acePostWriteDomLineHTML Hook
 * called after the DOM of the ace editor has been changed

 * @param {String} hook_name the name of the hook
 * @param {Object} args context of the hook - for more information: http://etherpad.org/doc/v1.4.1/
 * @param {Function} cb the callback
 *
 * @return {Function} return of the cb
 */
exports.acePostWriteDomLineHTML = function(hook_name, args, cb) {

    if(initialized == false) {
        return cb();
    }
    
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
    
    return cb();
};


