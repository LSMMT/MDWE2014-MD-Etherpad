/*
 * Benoit Lathiere - Master 2 HANDI Paris 8 - 2013
 * AutoScrollDown plugin for Etherpad-Lite
 * server-side file
 */


var eejs = require("ep_etherpad-lite/node/eejs");

exports.eejsBlock_scripts = function(hook_name, args, cb){
	args.content = args.content + "<script type='text/javascript' language='JavaScript' src='../static/plugins/ep_autoscrolldown/static/js/autoscrolldown.js'></script>";
	return cb();
}

exports.eejsBlock_editbarMenuLeft = function(hook_name, args, cb){
	args.content = args.content + eejs.require("ep_autoscrolldown/templates/editbarButtons.ejs", {}, module);
	//args.content = args.content + "<li style='display:list-inline;'> <button onClick='scrollDown()' style='height:28px;'><label style='font-size:14px; color:black;'>AutoScrollDown</label></button><input type='checkbox' onchange='changeAutoScrollDown()' id='autoscrolldown_checkbox' title='Activer/désactiver le défilement automatique.'  /></li> <li class='separator'></li>";
	return cb();
}

exports.eejsBlock_styles = function (hook_name, args, cb) {
	  args.content = args.content + eejs.require("ep_autoscrolldown/templates/styles.ejs", {}, module);
	  return cb();
}
