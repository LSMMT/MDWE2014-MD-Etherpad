/*
 *
 * Handle server hooks: Menu stuff
 *
 */

var eejs = require('ep_etherpad-lite/node/eejs');


// trying to find hook for: URLPATH -> AUTHORISATION(client-id, padId)
exports.padLoad = function(hook_name, args, cb) {
  
  console.log("hello padLoad!");
  return cb();
}


// trying to find hook for: URLPATH -> AUTHORISATION(client-id, padId)
exports.handleMessage = function(hook_name, args, cb) {
  
  console.log("hello handleMessage!");
  return cb();
}


// trying to find hook for: URLPATH -> AUTHORISATION(client-id, padId)
exports.authorize = function(hook_name, args, cb) {
  
  console.log("hello authorize!");
  return cb();
}


// trying to find hook for: URLPATH -> AUTHORISATION(client-id, padId)
exports.authenticate = function(hook_name, args, cb) {
  
  console.log("hello authenticate!");
  return cb();
}


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