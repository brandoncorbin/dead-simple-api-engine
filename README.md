# Dead Simple API Engine

An Express 4 based API built for simplicity.

**Just starting your project?** Use the Dead Simple API Starter Kit http://github.com/brandoncorbin/dead-simple-api

## Overview
The Dead Simple API Engine is a Node module that allows you to quickly build a maintainable restful API without all the headaches.

## Adding to your Project

````
npm install https://github.com/brandoncorbin/dead-simple-api-engine.git --save
````

1. Add DeadSimpleAPI to your application with ``require('dead-simple-api-engine')``.
2. Create your API folder (or copy from the ``test-api`` folder)
3. Call the new DeadSimpleAPI pass in your express app, and a configuration.
   1. The only required property is 	``basepath`` which is the path to your api's folder.  

```
var DeadSimpleAPI = require('dead-simple-api-engine');
var dsapi = new DeadSimpleAPI(app, {
	basepath : __dirname+'/api/', // Tell DSAPI where the API folder is located
	hooks : {
		before : function(req, res) {
			console.log("I get fired before each event");
		},
		after : function(json) {
			// Example on how to wrap all responses
			// var response = { time : new Date(),response : json };
			// return response;
			json.injected = true;
			return json;
		},

	}
}).scheduler.start(); // remove scheduler.start if you don't need scheduling.

```

### Folder Structure

- **api** Everything is contained within a folder, I recommend "api".
 - **routes** Folder for your Versions
   - **v1** First Version
	   - **test** API Module Folder
		   - **test.js** API Module Entry Point (must always be the name of it's parent folder)

In the example above we'd access this test.js by visiting ``localhost:3100/api/v1/test``

#### Example Trigger: test.js

The following will produce ``/api/v1/test/`` and ``/api/v1/test/world``

```
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.json({
    message : 'If this message also has a property of "Injected", everything is working just find.'
	});
});

router.get('/world', function (req, res) {
  res.send('The World said "Hello" back!');
});

module.exports = router; // Send it to the App
```
