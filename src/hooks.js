/**
 *
 * Handle server hooks
 *
 */

var eejs = require('ep_etherpad-lite/node/eejs');


// Client js               (loads static/js/client.js, heatmapconfig.js, heatmap.min.js)
exports.eejsBlock_scripts = function(hook_name, args, cb) {
	args.content = args.content + eejs.require("ep_heatmap/templates/scripts.ejs", {}, module);
	return cb();
}

// Menu button
exports.eejsBlock_editbarMenuRight = function(hook_name, args, cb) {
	args.content = args.content + eejs.require("ep_heatmap/templates/editbarMenu.ejs", {}, module);
  return cb();
}

// Menu button style       (loads static/css/styles.css)
exports.eejsBlock_styles = function (hook_name, args, cb) {
	  args.content = args.content + eejs.require("ep_heatmap/templates/styles.ejs", {}, module);
	  return cb();
}
