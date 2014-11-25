var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var preston = require('preston');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost:27017/1plus1');

var Team = mongoose.model('Team', new mongoose.Schema({
  name: String,
  members: [String]
}));

preston(Team);

var pairer = require('./lib/pairer');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/api', preston.middleware());

app.post('/pair', function(req, res) {
  var times = parseInt(req.body.times);
  if (isNaN(times)) {
    times = 1;
  }

  var pairings = [];
  _.times(times, function() {
    var pairs = pairer(req.body.teams, req.body.pairings);
    pairings.push(pairs);
    req.body.pairings.push(pairs);
  });
  res.json(pairings);
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on *:' + port);
});

