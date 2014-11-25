var express = require('express');
var bodyParser = require('body-parser');

var pairer = require('./lib/pairer');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.post('/pair', function(req, res) {
  var pairs = pairer(req.body.teams, req.body.pairings);
  res.json(pairs);
});

app.listen(3000, function() {
  console.log('Listening on *:3000');
});

