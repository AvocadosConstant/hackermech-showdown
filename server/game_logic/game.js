var MongoClient = require('mongodb').MongoClient;
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

var getItems = function () {
  var items = itemList();
  for (var i = 0; i < 3; i++) {
    items.splice(Math.round(Math.random() * (4-i)), 1);
  }
  return items;
};

exports.setup = function() {
  var state = {
    'items': getItems()
  };
  return state;
};

function attackCb(mech) {
  return function(part, target) {
    mech.attack(part, target);
  };
}

function equipCb(mech) {
  return function(item, part) {
    var rv = mech.equip(item, part);
    if (!rv) debug('Equip failed ' + part + ': ' + item);
  };
}

exports.run = function(cb) {
  games.findOne({'type': 'game_state'}, function (err, docs) {
    if (err || !docs) {
      debug('run game ', err);
      cb(err, null);
    } else if (docs.player1.code && docs.player2.code) {
      var player1 = new Player(), player2 = new Player();
      var attack1 = attackCb(player1), attack2 = attackCb(player2);
      var equip1 = equipCb(player1), equip2 = equipCb(player2);

      var code1 = `
      var mech = application.remote;
      ${docs.player1.code}
      function damage(part, d) { mech[part] -= d; }
      function getPartDamage(part) { return mech.turnDamage[part]; }
      function resetTurnDamage() { mech.resetTurnDamage(); }
      function isAlive() { return mech.chest > 0; }
      var api = {damage: damage, getPartDamage: getPartDamage, resetTurnDamage: resetTurnDamage,
      init: init, tick: tick, isAlive: isAlive};
      application.setInterface(api);`;
      var plugin1 = new jailed.DynamicPlugin(code1, {attack: attack1, equip: equip1});
      var code2 = `
      var mech = application.remote;
      ${docs.player2.code}
      function damage(part, d) { mech[part] -= d; }
      function getPartDamage(part) { return mech.turnDamage[part]; }
      function resetTurnDamage() { resetTurnDamage(); }
      function isAlive() { return mech.chest > 0; }
      var api = {damage: damage, getPartDamage: getPartDamage, resetTurnDamage: resetTurnDamage,
      init: init, tick: tick, isAlive: isAlive};
      application.setInterface(api);`;
      var plugin2 = new jailed.DynamicPlugin(code2, {attack: attack2, equip: equip2});
      //var damage = function(part) {
        //plugin1.remote.damage(part, plugin2.remote.getPartDamage(part));
        //plugin2.remote.damage(part, plugin1.remote.getPartDamage(part));
      //};
      var result = [];

      plugin1.whenFailed(function(data) {
        debug(data);
      });

      plugin1.whenConnected(function() {
        plugin2.whenConnected(function() {
          plugin1.remote.init();
          plugin2.remote.init();

          while (player1.isAlive() && player2.isAlive()) {
            if (player1.isAlive()) {
              plugin1.remote.tick();
            }
            if (player2.isAlive()) {
              plugin2.remote.tick();
            }

            var parts = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg', 'torso'];
            //parts.forEach(damage);
            for (var i = 0; i < parts.length; i++) {
              player1[parts[i]].health -= player2.turnDamage[parts[i]];
              player2[parts[i]].health -= player1.turnDamage[parts[i]];
            }
            player1.resetTurnDamage();
            player2.resetTurnDamage();
          }

          if (player1.isAlive()) {
            result.push('Player 1 wins!');
          } else if (player2.isAlive()) {
            result.push('Player 2 wins!');
          } else {
            result.push('It\'s a draw');
          }
          cb(null, result);
        });
      });
    } else {
      debug(docs.player1);
      debug(docs.player2);
      cb('Player submissions not complete', null);
    }
  });

};
