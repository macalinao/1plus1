var _ = require('lodash');
var expect = require('chai').expect;
var pairer = require('../lib/pairer');

var teams = [{
  name: 'The Beatles',
  members: [
    'paul@mccartney.org',
    'john@lennon.org',
    'george@harrison.org',
    'ringo@starr.org'
  ]
}, {
  name: 'The Quarrymen',
  members: [
    'john@lennon.org',
    'paul@mccartney.org',
    'stu@stucliffe.org'
  ]
}, {
  name: 'Wings',
  members: [
    'paul@mccartney.org',
    'linda@mccartney.org'
  ]
}, {
  name: 'Plastic Ono Band',
  members: [
    'john@lennon.org',
    'yoko@ono.org'
  ]
}, {
  name: 'Traveling Wilburys',
  members: [
    'george@harrison.org',
    'tom@petty.org',
    'roy@orbison.org'
  ]
}];

describe('heuristic', function() {

  it('should not pair up a person to itself', function() {
    var pairs = pairer.generatePairs(teams, []);
    _.each(pairs, function(p) {
      expect(p[0]).to.not.equal(p[1]);
    });
  });

  it('should not have duplicate pairs', function() {
    var pairs = pairer.generatePairs(teams, []);
    var found = [];
    _.each(pairs, function(p) {
      var res = _.find(found, function(f) {
        return _.contains(p, f[0]) && _.contains(p, f[1]);
      });
      expect(res).to.be.undefined;

      found.push(p);
    });
  });

  it('should not have any different team matches with first time potential teams', function() {
    var pairs = pairer.generatePairs(pairer.teamsToPeople(teams), []);
    _.each(pairs, function(pair) {
      var p0 = pair[0];
      var p1 = pair[1];

      expect(pairer.sharesTeams(p0, p1)).to.be.true;
    });
  });

  it('should pair people of the same team', function() {
    var a = teams[4].members[0];
    var b = teams[4].members[2];
    var pairs = pairer.generatePairs(pairer.teamsToPeople(teams), []);
    expect(_.find(pairs, function(p) {
      return ((p[0].name == a || p[1].name == a) && (p[0].name == b || p[1].name == b));
    })).to.not.be.undefined;
  });

  it('should not have any of the same pairs as last time', function() {
    var a = teams[4].members[0];
    var b = teams[4].members[2];
    var c = teams[4].members[1];

    var pairs = pairer.generatePairs(pairer.teamsToPeople(teams), [
      [
        [a, b]
      ]
    ]);

    var res = _.find(pairs, function(p) {
      return ((p[0].name == a || p[1].name == a) && (p[0].name == b || p[1].name == b));
    });
    expect(res).to.be.undefined;

    // Check if we still have pairs
    res = _.find(pairs, function(p) {
      return ((p[0].name == a || p[1].name == a) && (p[0].name == c || p[1].name == c));
    });
    expect(res).to.not.be.undefined;
  });

});

describe('pair', function() {

  it('should pair', function() {
    var res = pairer(teams, []);
    console.log(res);
  });

});
