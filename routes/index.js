var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	console.log('...  /index route is called.... ');
  res.json({message:"Welcome to index page"});
});

module.exports = router;
