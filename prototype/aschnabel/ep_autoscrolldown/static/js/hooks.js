/*
 * Benoit Lathiere - Master 2 HANDI Paris 8 - 2013
 * autoScrollDown plugin for Etherpad-Lite
 * client-side JS hook file
 */

exports.acePostWriteDomLineHTML = function(hook_name, args, cb) {		//context.node : the DOM node that just got written to the page
	console.log("autoscrolldown.acePostWriteDomLineHTML");	//debug
	if ($('#autoscrolldown_checkbox').is(':checked')){
		console.log("changeAutoScrollDown() case cochée");	//debug
		scrollDown();
	}
};
