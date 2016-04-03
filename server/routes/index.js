var express = require('express');
var router = express.Router();
var debug = require('debug')('mech-fight-server:server');
var MongoClient = require('mongodb').MongoClient;

var db;
var games;
var db_url = process.env['MONGO_PORT_27017_TCP'] || 'mongodb://127.0.0.1:27017';
db_url = db_url.replace('tcp', 'mongodb');
db_url += '/mech';

MongoClient.connect(db_url, (err, database) => {
  if(!err) {
    db = database;
    games = db.collection('games');
  } else {
    const EventEmitter = require('events');
    const ee = new EventEmitter();
    ee.emit('error', new Error('Database connection failed'));
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
  games.findOne({'type': 'results'}, function(err, docs) {
    if(err || !docs) {
      res.status(404).send({'status': 'not found'});
    }
    else {
      res.send(docs);
    }
  });
});

module.exports = router;
