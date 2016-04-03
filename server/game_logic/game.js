var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Player = require('./Player.js');
var itemList = require('./itemList.js');
var debug = require('debug')('mech-fight-server:gamejs');
var jailed = require('jailed');

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
  for (var i = 0; i < 3; i++) {
    items.splice(Math.round(Math.random() * (4-i)), 1);
  }
};

exports.setup = function() {
  var state = {
    'items': getItems(),
  };
  return state;
};

exports.run = function(cb) {
  games.findOne({'type': 'results'}, function (err, docs) {
    if (err || docs) {
      debug('run game ', err);
      cb(err, null);
    } else if (!docs.player1.code && !docs.player2.code) {
      var code1 = `var mech = application.remote.mech;\n${docs.player1.code}`;
      var plugin1 = jailed.DynamicPlugin(docs.player1.code, {mech: new Player()});
      var code2 = `var mech = application.remote.mech;\n${docs.player2.code}`;
      var plugin2 = jailed.DynamicPlugin(docs.player2.code, {mech: new Player()});
      var damage = function(part) {
        plugin1.remote.mech[part] -= plugin2.remote.mech.turnDamage[part];
        plugin2.remote.mech[part] -= plugin1.remote.mech.turnDamage[part];
      };
      var result = [];

      plugin1.remote.init();
      plugin2.remote.init();

      while (plugin1.remote.mech.chest > 0 && plugin2.remote.mech.chest > 0) {
        if (plugin1.remote.mech.chest > 0) {
          plugin1.remote.tick();
        }
        if (plugin2.remote.mech.chest > 0) {
          plugin2.remote.tick();
        }
        var parts = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'chest'];
        parts.forEach(damage);
      }

      if (plugin1.remote.mech.chest > 0) {
        result.push('Player 1 wins!');
      } else if (plugin2.remote.mech.chest > 0) {
        result.push('Player 2 wins!');
      } else {
        result.push('It\'s a draw');
      }
      cb(null, result);
    }
  });
  
};
