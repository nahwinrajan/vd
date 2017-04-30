var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'API Home',
    content: null
  });
});

/* GET home page. */
router.post('/', function(req, res, next) {
  res.render('index', {
    title: 'Key API',
    content: "posting..."
  });
});

router.get('/:key', function(req, res, next) {
  res.render('index', {
    title: 'API Home',
    content: req.params.key
  });
});

module.exports = router;
