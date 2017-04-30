var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: "vd-test",
    content: `
      Hi there, mate!!\n
      you are on the right place.\n
      You can do the followings:\n
      - 'GET' request to /object/yourKeyValue\n
      - 'GET' request to /object/yourKeyValue?timestamp=###\n
      - 'POST' request to /object -> {"key": "value"}\n
    `
  })
});

module.exports= router;
