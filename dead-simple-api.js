var Scheduler = require('./modules/scheduler');
var moment = require("moment");
/**
 * Dead Simple API
 * @name API
 */
var DeadSimpleAPI = function (app, config) {
	console.log("###", config);
	config.hooks = config.hooks || {};
	config.hooks.before = config.hooks.before || null;
	config.hooks.after = config.hooks.after || null;
	config.cors = config.cors || {};
	config.cors.enabled = config.cors.enabled || false;
	config.cors.origins = config.cors.origins || '*';

	var fs = require('fs'),
		cors = require('cors'),
		moment = require('moment');

	if (config.hooks.before) {
		app.use(function (req, res, next) {
			config.hooks.after(req, res);
			next();
		});
	}

	if(config.cors.enabled) {
		app.use(cors());
		app.options(config.cors.origins, cors());
	}

	if (config.hooks.after) {
		app.use(function (req, res, next) {
			// grab reference of render
			var _render = res.json;
			// override logic
			res.json = function (json, fn) {
				// do some custom logic
				var pjson = config.hooks.after(json);
				if (typeof pjson !== "undefined") {
					json = pjson;
				}
				// continue with original render
				_render.call(this, json, {}, fn);
			};
			next();
		});
	}
	/**
	 * Route Definition
	 * Creates the Routes for the API based on the Routes Folder
	 */
	var routeVersionDirectories = fs.readdirSync(config.basepath + 'routes/'); // Get Versions via Folder Structure
	for (var i = 0; i < routeVersionDirectories.length; i++) { // Loop Over API versions
		if (fs.lstatSync(config.basepath + 'routes/' + routeVersionDirectories[i]).isDirectory() === true) { // Confirm it's a Directory
			var version = routeVersionDirectories[i]; // Get Version of API
			var versionRoutes = fs.readdirSync(config.basepath + 'routes/' + version + '/'); // Get Routes for this Version as Array
			for (var vr = 0; vr < versionRoutes.length; vr++) { // Loop over version route array
				if (fs.lstatSync(config.basepath + 'routes/' + version).isDirectory() === true) { // Confirm it's a directory
					var routePath = config.basepath + '/routes/' + version + '/' + versionRoutes[vr] + '/' + versionRoutes[vr] + '.js'; // Set the path /v1/folder/folder.js
					var path = version + '/' + versionRoutes[vr]; // Set API path /v1/folder
					app.use('/' + path, require(routePath)); // Pass it to Express
				} // end version route is a folder
			} // end loop of version routes
		} // if if version is a folder
	}




	this.scheduler = new Scheduler(app, config);

};

module.exports = DeadSimpleAPI;
