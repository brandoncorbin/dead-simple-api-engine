
var express = require('express');
var app = express();

var DeadSimpleAPI = require('./dead-simple-api.js');
var dsapi = new DeadSimpleAPI(app, {
	basepath : __dirname+'/test-api/', // Tell DSAPI where the API folder is located
	hooks : {
		before : function(req, res) {
			console.log("I get fired before each event");
		},
		after : function(json) {
			json.injected = true;
			return json;
		},

	}
}).scheduler.start(); // remove scheduler.start if you don't need scheduling.


var server = app.listen(3100, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('http://%s:%s/v1/test/world', host, port);
});
