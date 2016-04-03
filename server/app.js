var express = require('express');
var app = express();
var game = require('./game_logic/game.js');


// We need middleware (body-parser) to make JSON encoded body be readible

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/join', function (req, res) {
  res.send(game.addPlayer());
});

app.get('/setup', function (req, res) {
  var gameState = game.init();
  res.send(JSON.stringify(gameState));
});

app.get('/submit', function (req, res) {
  var player = req.body.player;
  var code = req.body.code;
  var result = game.run(player, code);
  res.send(JSON.stringify(result));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
