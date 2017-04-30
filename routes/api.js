var express = require('express');
var router = express.Router();

// variables - models
var objModel = require("./../models/object");

router.post('/', function(req, res, next) {
  let parcel = req.body;
  let keyname = "";
  let val = "";

  let result = {
    code: "200",
    message: "",
    data: null
  }

  if (Object.keys(parcel).length == 0) {
    result = {
      code: "400",
      message: "invalid parameters",
      data: null
    }
    res.status = 400;
  } else {
    Object.keys(parcel).forEach(function(key, index){
      // keep it simple for the moment, only take first key on each request
      if (index == 0) {
        parcel[key] = req.sanitize(parcel[key]);
        keyname = key;
        val = req.sanitize(parcel[key]);
        parcel = null;
      }
    });

    objModel.create({
      "objKey": keyname,
      "objValue": val
    }, (err, data) => {
      if(err) {
        console.log(err);
        result = {
          code: "500",
          message: "something went wrong in our server; please try again",
          data: null
        }
        res.status = 500;
      } else {
        result = {
          code: "200",
          message: "",
          data: data
        }
        res.status = 200;
      }
    });
  }

  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(result));
});

router.get('/:key', function(req, res, next) {
  let k = req.params.key;
  let t = req.sanitize(req.query.timestamp);

  let result = {
    code: "200",
    message: "",
    data: null
  };

  if (t !== undefined && t !== "" && isNaN(t)) {
    result = {
      code: "400",
      message: "invalid parameters",
      data: null
    };
    res.status = 400;

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(result));
  } else if (t !== undefined && t !== "") {
    objModel.findByKeyWithTimestamp(k, t, (err, data) => {
      if (err) {
        console.log(err);
        result = {
          code: "500",
          message: err,
          data: null
        };
        res.status = 500;
      } else {
        result = {
          code: "200",
          message: "",
          data: data
        };
        res.status = 200;
      }

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(result));
    });
  } else {
    objModel.findByKey(k, (err, data) => {
      if (err) {
        console.log(err);
        result = {
          code: "400",
          message: "invalid parameters",
          data: null
        };
        res.status = 400;
      } else {
        console.log("find result: ", data);
        result = {
          code: "200",
          message: "",
          data: {
            value: data[0].objValue
          }
        };
        res.status = 200;
      }

      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(result));
    });
  }
});

module.exports = router;
