var express = require('express');
var router = express.Router();
var debug = require('debug')('mech-fight-server:routes');
var MongoClient = require('mongodb').MongoClient;

var game = require('../game_logic/game.js');

var db;
var games;
var db_url = process.env['MONGO_PORT_27017_TCP'] || 'mongodb://127.0.0.1:27017';
db_url = db_url.replace('tcp', 'mongodb');
db_url += '/mech';

MongoClient.connect(db_url, (err, database) => {
  if(!err) {
    debug('Database connection success');
    db = database;
    games = db.collection('games');
  } else {
    // It's unsafe to continue, crash the server.
    const EventEmitter = require('events');
    const ee = new EventEmitter();
    ee.emit('error', new Error('Database connection failed'));
  }
});

/*
 * Starts the clock, users have X minutes to call /submit
 */
router.get('/join', function(req, res) {
  games.findOne({'type': 'game_state'}, function(err, docs) {
    if(err) {
      debug('get /join ', err);
      res.status(500).send(err);
    } else if(!docs) {
      res.status(404).send({'status': false});
    } else if(docs.participants < 2) {
      res.send({'status': false});
    } else {
      res.send({'status': true, data: docs});
    }
  });
});

/*
 * Prepare the game state and pick the weapons
 * Users need to poll /join until a positive status is returned
 */
router.get('/setup', function(req, res) {
  games.findOne({'type': 'game_state'}, function(err, docs) {
    if(err) {
      debug('get /setup ', err);
      res.status(500).send(err);
    } else if(!docs) {
      var initial = game.setup();
      initial.type = 'game_state';
      initial.participants = 1;
      games.insertOne(initial, function(err, docs) {
        if(err) {
          debug('get /setup ', err);
          res.status(500).send(err);
        } else {
          res.send({'status': 'pending', 'player': 1, 'data': initial, 'inserted': docs});
        }
      });
    } else {
      // Increment is atomic!
      games.updateOne({'type': 'game_state'}, {$inc:{'participants':1}});
      res.send({'status': 'ready', 'player': 2, 'data': docs});
    }
  });
});

router.get('/results', function(req, res) {
  games.findOne({'type': 'results'}, function(err, docs) {
    if(err || !docs) {
      debug('get /results ', err);
      res.status(404).send({'status': 'not found'});
    } else {
      res.send(docs);
    }
  });
});

router.get('/clear', function(req, res) {
  games.deleteMany({$or: [{'type': 'results'}, {'type': 'game_state'}]}, function(err, docs) {
    if(err) {
      debug('get /clear ', err);
      res.status(500).send(err);
    } else {
      res.send(docs);
    }
  });
});

router.post('/submit', function(req, res) {
  debug(req.body);
  var code = req.body.code;
  if(req.body.player == 1) {
    games.updateOne({'type': 'game_state'}, {$set: {player1: {code: code}}}, function(err) {
      if(err) {
        res.status(500).send(err);
      } else {
        res.send({'status': 'okay'});
      }
    });
  } else if(req.body.player == 2) {
    games.updateOne({'type': 'game_state'}, {$set: {player2: {code: code}}}, function(err) {
      if(err) {
        res.status(500).send(err);
      } else {
        res.send({'status': 'okay'});
      }
    });
  } else {
    res.status(400).send({'status': 'invalid_player'});
  }
});

module.exports = router;
