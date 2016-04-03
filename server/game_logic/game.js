var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var db_url = process.env['MONGO_PORT_27017_TCP'] || 'mongodb://127.0.0.1:27017';
db_url = db_url.replace('tcp', 'mongodb');
db_url += '/mech';
MongoClient.connect(db_url, function(err, db) {
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
