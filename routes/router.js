const express = require("express");
const router = express.Router();
const mongo = require("mongodb").MongoClient;
const dbUrl = "mongodb://localhost:27017/robos";

function findDoc(db, params, callback) {
  let collection = db.collection("data");
  console.log(params);
  collection.find(params).toArray(function (err, data) {
    callback(data);
  });
}

function render(res, pageToBeRendered, params) {
  mongo.connect(dbUrl, function (err,db) {
    findDoc(db, params, function (data) {
      res.render(pageToBeRendered, {users:data});
    });
  });
}

router.get("/",function (req,res) {
  render(res,"index");
});

router.get("/user/:name",function (req,res) {
  render(res, "user", {"name": req.params.name});
});

router.get("/unEmployed",function (req,res) {
  render(res,"index",{"job":null});
});

router.get("/employed",function (req,res) {
  render(res,"index",{"job":{$ne:null}});
});

router.get("/country/:country",function (req,res) {
  render(res,"index",{"address.country":req.params.country});
});

router.get("/skill/:skill",function (req,res) {
  render(res,"index", {"skills": {$elemMatch: {$eq:req.params.skill}}});
});
module.exports = router;
