var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var preston = require('preston');
var mongoose = require('mongoose');

if (process.env.REDISTOGO_URL) {
  var rtg = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(":")[1]);
} else {
  var redis = require("redis").createClient();
}

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

app.get('/lastpairs', function(req, res) {
  redis.get('lastpairs', function(err, data) {
    if (err) {
      return res.send(err);
    }

    res.json(JSON.parse(data) || []);
  });
});

app.post('/pair', function(req, res) {
  var times = parseInt(req.body.times);
  if (isNaN(times)) {
    times = 1;
  }

  var old = req.body.pairings || [];

  var pairings = [];
  _.times(times, function() {
    var pairs = pairer(req.body.teams, old);
    pairings.push(pairs);
    old.push(pairs);
  });
  res.json(pairings);

  redis.get('lastpairs', function(err, data) {
    if (data) {
      var arr = JSON.parse(data).concat(pairings);
      redis.set('lastpairs', JSON.stringify(arr));
    } else {
      redis.set('lastpairs', JSON.stringify(pairings));
    }
  });

});

app.post('/reset_pairings', function(req, res) {
  redis.del('lastpairs');
  res.send('OK');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on *:' + port);
});
