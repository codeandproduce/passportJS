var express = require('express');
var router = express.Router();

// get homepage
router.get('/', (req, res) =>{
  res.render('index');
});

module.exports = router;