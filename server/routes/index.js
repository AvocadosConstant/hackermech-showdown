var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var db, games;
var db_url = process.env['MONGO_PORT_27017_TCP'].replace('tcp', 'mongodb');
MongoClient.connect(db_url, (err, database) => {
  if(!err) {
    db = database;
    users = db.collection('games');
  }
});

router.get('/setup', function(req, res) {
  res.send({
  });
});

router.post('/submit', function(req, res) {
});

router.get('/results', function(req, res) {
});

module.exports = router;
