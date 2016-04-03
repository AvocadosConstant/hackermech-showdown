var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var jailed = require('jailed');
var player = require('./Player.js');
var itemList = require('./itemList.js');
var debug = require('debug')('mech-fight-server:gamejs');

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
  for (var i = 0; i < 2; i++) {
    items.splice(Math.round(Math.random() * (4-i)), 1);
  }
  debug(items);
};

exports.setup = function() {
  var state = {
    'round': 0,
    'items': ['item1', 'item2', 'item3'],
    'history': [],
    'wins': {'player1': 0, 'player2': 0}
  };
  return state;
};

var turn = function () {
};

var api = {
};

var initRound = function(err, docs) {
  if (!err && docs) {
    var globalState = docs;
    var roundState = {
      'player1': new player.Player(),
      'player2': new player.Player()
    };
  }
};

exports.run = function() {
  games.findOne({'type': 'results'}, callback);

};

getItems();
