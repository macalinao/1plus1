angular.module('1plus1', [])

.controller('MainCtrl', function($scope, $http) {
  $scope.newTeam = {
    members: []
  };

  $scope.teams = [{
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

  $scope.createNewTeam = function() {
    if (!$scope.newTeam.name) {
      alert('Team name cannot be empty');
      return;
    }

    if ($scope.newTeam.members.length == 0) {
      alert('Team members cannot be empty');
      return;
    }

    $scope.teams.push(_.clone($scope.newTeam));
    $scope.newTeam = {
      members: []
    };
  };

  $scope.addMember = function() {
    var member = $scope.newTeam.newMember;
    $scope.newTeam.newMember = '';
    if ($scope.newTeam.members.indexOf(member) !== -1) {
      alert('Already a member');
      return;
    }
    $scope.newTeam.members.push(member);
  };

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  $scope.pairings = [];

  $scope.nextPairing = function() {
    var teams = $scope.teams;
    var pairings = $scope.pairings;

    $http.post('/pair', {
      teams: teams,
      pairings: pairings
    }).then(function(res) {
      pairings.push(res.data);
    });
  };

});
