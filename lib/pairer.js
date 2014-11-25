var _ = require('lodash');

function canPairDiff(lastPairs, people, a) {
  var brk = true;
  _.each(a.teams, function(t) {
    if (t.members.length > 2) {
      brk = false;
      return;
    }
  });
  if (brk) {
    return false;
  }

  var wasInLast = _.find(lastPairs, function(p) {
    var p0 = _.find(people, function(e) {
      return e.name == p[0];
    });
    var p1 = _.find(people, function(e) {
      return e.name == p[1];
    });
    return p0.team == a.team && p0.team == p1.team;
  });

  return wasInLast;
}

/**
 * Generates valid pairs.
 */
function generatePairs(people, pairings) {
  var lastPairs = _.last(pairings);

  var pairs = [];

  _.each(people, function(a) {
    _.each(people, function(b) {

      if (a.name === b.name) {
        return;
      }

      // Prevent duplicates
      if (_.find(pairs, function(p) {
        return _.contains(p, a) && _.contains(p, b);
      })) return;

      // Prevent last pairs
      if (lastPairs) {
        if (_.find(lastPairs, function(p) {
          return ((p[0] == a.name || p[1] == a.name) && (p[0] == b.name || p[1] == b.name));
        })) return;
      }

      // Teams not shared 
      if (!sharesTeams(a, b)) {
        if (!canPairDiff(lastPairs, people, a) || !canPairDiff(lastPairs, people, b)) {
          return;
        }
      }

      pairs.push([a, b]);

    });
  });

  return pairs;
};

/**
 * Scores pairs.
 */
function scorePair(pair, pairings) {
  if (pair.score) {
    return pair.score;
  }

  // Get number of weeks since the last pairing.
  var sinceIdx = _.findLastIndex(pairings, function(p) {
    return _.contains(p, pair[0].name) && _.contains(p, pair[1].name);
  });
  var since = sinceIdx == -1 ? -1 : pairings.length - sinceIdx;

  if (since != -1) {
    // Normalize since from 0 to 1. If greater than 1, it is a high priority pair.
    var sinceScale = _.reduce(pair, function(mm, p) {
      mm = _.reduce(p.teams, function(m, team) {
        m += team.members.length;
      }, 0) / teams.length;
    }, 0) / pair.length;
    var sinceScale = (pair[0].teams[0].members.length + pair[1].teams[0].members.length) / 2;
    since /= sinceScale;
  }

  var score = (since == -1) ? 2 : since;

  // prevent orphans
  if ((pair[0].teams.length === 1 && pair[0].teams[0].members.length === 2) || (pair[1].teams.length === 1 && pair[1].teams[0].members.length === 2)) {
    score += 2;
  }

  pair.score = score;
  return score;
};

function teamsToPeople(teams) {
  // Convert teams to an object of people
  var people = [];
  _.each(teams, function(team) {
    _.each(team.members, function(member) {
      var person = _.find(people, function(p) {
        return p.name == member;
      });

      if (!person) {
        people.push({
          name: member,
          teams: [team],
          tn: [team.name]
        });
        return;
      }

      person.teams.push(team);
      person.tn.push(team.name);

    });
  });
  return people;
}

function sharesTeams(p0, p1) {

  var intersect = false;
  _.each(p0.teams, function(a) {
    _.each(p1.teams, function(b) {
      if (a == b) {
        intersect = true;
      }
    });
  });
  return intersect;

}

/**
 * The function that pairs everyone together
 */
function pair(teams, pairings) {
  if (!pairings) {
    pairings = [];
  }

  var people = teamsToPeople(teams);

  // Generate shuffled pairs to randomize a bit
  var pairs = _.shuffle(generatePairs(people, pairings));
  pairs = pairs.sort(function(a, b) {
    return scorePair(b) - scorePair(a);
  });

  var ret = [];
  _.each(pairs, function(p) {
    if (!p[0].used && !p[1].used) {
      ret.push(p);
      p[0].used = true;
      p[1].used = true;
      people.splice(people.indexOf(p[0]), 1);
      people.splice(people.indexOf(p[1]), 1);
      return;
    }
  });

  // Pair leftovers
  if (people.length > 1) {
    for (var i = 0; i < people.length - 1; i += 2) {
      ret.push([people[i], people[i + 1]]);
      people.splice(people.indexOf(people[i]), 1);
      people.splice(people.indexOf(people[i + 1]), 1);
    }
  }

  // Put last person on first pair
  if (people[0]) {
    ret[0].push(people[0]);
  }

  var rets = [];
  _.each(ret, function(r) {
    rets.push(_.pluck(r, 'name'));
  });
  return rets;
};

// Pair
pair.generatePairs = generatePairs;
pair.scorePair = scorePair;
pair.teamsToPeople = teamsToPeople;
pair.sharesTeams = sharesTeams;
module.exports = pair;
