/*
 *
 * Handle server hooks: Menu stuff
 *
 */

//var Changeset = require("ep_etherpad-lite/static/js/Changeset");
//var settings = require('ep_etherpad-lite/node/utils/Settings');
var eejs = require('ep_etherpad-lite/node/eejs');


// Client js
exports.eejsBlock_scripts = function(hook_name, args, cb) {

	args.content = args.content + "<script type='text/javascript' language='javascript' src='../static/plugins/ep_heatmap/static/js/client.js'></script>";
	return cb();
}


// Menu buttons
exports.eejsBlock_editbarMenuLeft = function(hook_name, args, cb) {

	args.content = args.content + eejs.require("ep_heatmap/templates/editbarMenu.ejs", {}, module);
  return cb();
}


// Menu button style               (static/css/styles.css)
exports.eejsBlock_styles = function (hook_name, args, cb) {

	  args.content = args.content + eejs.require("ep_heatmap/templates/styles.ejs", {}, module);
	  return cb();
}

/*function createChangeset(cs) {
	console.log(Changeset.unpack(cs));
}
*/