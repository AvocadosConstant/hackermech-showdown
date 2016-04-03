var debug = require('debug')('mech-fight-server:appjs');
debug('launched app.js');
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var api = require('./routes/index');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.use(morgan('dev'));

app.use('/api', api);

var listener = app.listen(process.env.PORT || 3000, function() {
  debug('Listining on port %s.', listener.address().port);
});
