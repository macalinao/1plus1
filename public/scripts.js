angular.module('1plus1', [])

.controller('MainCtrl', function($scope) {
  $scope.newTeam = {
    members: []
  };
  $scope.teams = [];

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

  $scope.pairings = [
    [{a: 'a@b.com', b:'b@a.com'}]
  ];

  $scope.nextPairing = function() {
    var teams = $scope.teams;
    var pairings = $scope.pairings;
  };

});
