var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:3000';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});

exports.addPlayer = function() {
  console.log("addPlayer");
};

exports.init = function() {
  console.log("init");
};

exports.run = function(player, code) {
  console.log("run");
};
