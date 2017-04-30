var chai  = require("chai");
var expect = chai.expect;

var mongoose = require('mongoose');

// import model
var objModel = require("../../models/object");

describe("Object Model", () => {
  before((done) => {
    mongoose.connect('mongodb://localhost/vd-test');
    done();
  });

  after((done) => {
    objModel.remove({objKey: "auto-test"}, (err, doc) => {
      if (err) {
        console.log("error while cleaning db: " + error);
      } else {
        console.log("done cleaning db from test");
      }
    });
    done();
  });

  describe("given valid object", () => {
    it("should create new record", (done) => {
      let o = new objModel({
        objKey: "auto-test",
        objValue: "testValue",
      });

      o.save((err, doc) => {
        expect(doc.objKey).to.equal(o.objKey);
        expect(doc.objValue).to.equal(o.objValue);
        expect(doc.timestampUTC).to.exist;
        done();
      });
    });
  });

  describe("given invalid object", () => {
    it("should be invalid if key is empty", () => {
      let o = new objModel({
        objKey: "",
        objValue: "testValue",
      });

      o.save((err, doc) => {
        expect(err).to.exist;
        done();
      });
    });

    it("should be invalid if value is empty", () => {
      let o = new objModel({
        objKey: "auto-test",
        objValue: "",
      });

      o.save((err, doc) => {
        expect(err).to.not.be.null;
        done();
      });
    });

    it("should be invalid if key is longer than 250 characters", () => {
      let o = new objModel({
        objKey: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        objValue: "testValue",
      });

      o.save((err, doc) => {
        expects(err).to.not.be.null;
        done();
      });
    });

    it("should be invalid if value is longer than 500 characters", () => {
      let o = new objModel({
        objKey: "auto-test",
        objValue: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      });

      o.save((err, doc) => {
        expect(err).to.not.be.null;
        done();
      });
    });
  });
});
