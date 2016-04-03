var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('gpgchat-server:server');
var morgan = require('morgan');

var api = require('./routes/index');

var app = express();
var game = require('./game_logic/game.js');
var bodyParser = requre('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded());


app.use(morgan('dev'));

app.use('/api', api);

app.listen(process.env.PORT || 3000);

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
