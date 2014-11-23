var expect = require('chai').expect;
var pairer = require('../lib/pairer');

var teams = [{
  name: 'The Beatles',
  members: [
    'paul@mccartney.org',
    'john@lennon.com',
    'george@harrison.org',
    'ringo@starr.org'
  ]
}];

describe('pairer', function() {

  it('should calculate next week', function() {
    var res = pairer(teams);
  });

});
