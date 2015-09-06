var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.json({
    success : true,
    message : 'If this message also has a property of "Injected", everything is working just find.'
	});
});

router.get('/world', function (req, res) {
  res.json({
    success : true,
    message : 'The World said "Hello" back!'
  });
});

module.exports = router; // Send it to the App
