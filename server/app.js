var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('gpgchat-server:server');
var morgan = require('morgan');

var api = require('./routes/index');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(morgan('dev'));

app.use('/api', api);

app.listen(process.env.PORT || 3000);
