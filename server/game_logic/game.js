var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var jailed = require('jailed');
var mech = require('Player.js');
var itemList = require('itemList.js');

var db;
var games;
var db_url = process.env['MONGO_PORT_27017_TCP'] || 'mongodb://127.0.0.1:27017';
db_url = db_url.replace('tcp', 'mongodb');
db_url += '/mech';

MongoClient.connect(db_url, (err, database) => {
  if(!err) {
    db = database;
    games = db.collection('games');
  }
  else {
    const EventEmitter = require('events');
    const ee = new EventEmitter();
    ee.emit('error', new Error('Database connection failed'));
  }
});

var getItems = function (round) {
  var items = itemList();
  for(int i = 0; i<3;i++){
    delete items[Math.round(Math.random()*(5-i))];
  }
};

exports.setup = function() {
  var state = {
    'round': 0,
    'items': ['item1', 'item2', 'item3'],
    'player1': {
      'wins': 0
    },
    'player2': {
      'wins': 0
    }
  };
  return state;
};

var turn = function () {
};

var api = {
  init: function(leftArm, rightArm, torso, leftLeg, rightLeg, cb) {
  }
};

var initRound = function(err, docs) {
  if (!err && docs) {
    var globalState = docs;
    var roundState;
  }
};

exports.run = function() {
  games.findOne({'type': 'results'}, callback);

};
