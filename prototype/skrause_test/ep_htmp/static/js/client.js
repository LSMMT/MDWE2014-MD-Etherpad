/*
 *
 * Client js
 *
 */


// Toggle Heatmap Status
var heatmap_status = false;

function changeHeatMapStatus() {

  heatmap_status = !heatmap_status;
  console.log("heatmap_status => "+(heatmap_status?"true":"false"));

  if (heatmap_status) {
    //console.log("enableHeatMapSidebar()");
    createNumericModel();
    console.log("generateHeatMap()");
  }
  else {
    console.log("disableHeatMapSidebar()");
  }

}


// getText of pad and generate array for heatmap
function createNumericModel() {
  console.log("createNumericModel()");

}


/*
	var newY=1000;
		if($.browser.mozilla || $.browser.opera || $.browser.msie) {	//FF and Opera ,MSIE
		var $outerdocHTML = $('iframe[name="ace_outer"]').contents().find("#outerdocbody").parent();
		var inner = $('iframe[name="ace_outer"]').contents().find("#outerdocbody").contents();	//the height varies with the content
		newY += inner.height();
		$outerdocHTML.animate({scrollTop: newY}, 2000); // needed for FF
	} else {	//Chrome
		var $outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
		newY += $outerdoc.height();
		$outerdoc.animate({scrollTop: newY}, 2000);
	}
	return false;
}*/
