// Maybe this functionality should be done.. better
var myFrame;// myFrame points now to the content of the editor

// 2D Array
/*
     |oldId|ep_activity|

 * TODO
 *   - 
 */
var olddivs;
var initialized = false;


function getDivArray() {


    return document.getElementsByName("ace_outer")[0].contentDocument.getElementsByName("ace_inner")[0].contentDocument.getElementById("innerdocbody").children;

}

/*
 *
 */
function initializeLineArray() {
    
    getIdsOfDivs();
};

function getIdsOfDivs() {
    console.log("getIdsOfDivs - myFrame: "  +  myFrame);
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

function reduceMagicDomId(magicdomid) {
    return magicdomid.replace("magicdomid", "");
};


exports.postAceInit = function(hook_name, args, cb) {
    /*
     * initialize everything 
     */
    olddivs = new Array();

    initializeLineArray();
    
    return cb();
};


/*
 * TODO: Documentation
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


