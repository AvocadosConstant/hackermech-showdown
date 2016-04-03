var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var db;
var games;
var db_url = 'mongodb://127.0.0.1:27017' || process.env['MONGO_PORT_27017_TCP'].replace('tcp', 'mongodb');
MongoClient.connect(db_url, (err, database) => {
  if(!err) {
    db = database;
    games = db.collection('games');
  }
});

router.get('/join', function(req, res) {
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
