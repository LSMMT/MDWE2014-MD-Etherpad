/*
 * Benoit Lathiere - Master 2 HANDI Paris 8 - 2013
 * autoScrollDown plugin for Etherpad-Lite
 * client-side JS file
 */

function scrollDown() {
	console.log('scrollDown()');	//debug
	var newY=1000;
	//Chrome
	var $outerdoc = $('iframe[name="ace_outer"]').contents().find("#outerdocbody");
	newY += $outerdoc.height(); // just scrolls to the end + 1000 ?
	$outerdoc.animate({scrollTop: newY}, 2000);
	return false;
}

function changeAutoScrollDown() {
	if ($('#autoscrolldown_checkbox').is(':checked')){
		scrollDown();
		console.log("changeAutoScrollDown() case cochée");	//debug

		// Armin
		console.log($('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody"));
		console.log("scollHeight: "+$('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").context.body.scrollHeight);
	} else {
		console.log("changeAutoScrollDown() case décochée");	//debug
	}
}