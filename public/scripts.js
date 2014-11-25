angular.module('1plus1', ['restangular'])

.controller('MainCtrl', function($scope, $http, Restangular) {
  $scope.newTeam = {
    members: []
  };

  var Team = Restangular.all('api/teams');

  $scope.teams = Team.getList().$object;

  $scope.createNewTeam = function() {
    if (!$scope.newTeam.name) {
      alert('Team name cannot be empty');
      return;
    }

    if ($scope.newTeam.members.length == 0) {
      alert('Team members cannot be empty');
      return;
    }

    var newTeam = _.clone($scope.newTeam);
    $scope.newTeam = {
      members: []
    };
    Team.post(newTeam).then(function(data) {
      $scope.teams.push(data);
    });
  };

  $scope.addMember = function() {
    var member = $scope.newMember;
    $scope.newMember = '';
    if ($scope.newTeam.members.indexOf(member) !== -1) {
      alert('Already a member');
      return;
    }
    $scope.newTeam.members.push(member);
  };

  $scope.deleteNewMember = function(i) {
    $scope.newTeam.members.splice(i, 1);
  };

  $scope.getNumber = function(num) {
    return new Array(num);
  };

  $scope.pairings = [];
  $http.get('/lastpairs').then(function(res) {
    $scope.pairings = res.data || [];
  });

  $scope.nextPairing = function(times) {
    var teams = $scope.teams;
    var pairings = $scope.pairings;

    $http.post('/pair', {
      teams: teams,
      pairings: pairings,
      times: times
    }).then(function(res) {
      var newPairs = res.data;
      $scope.pairings = pairings.concat(newPairs);
    });
  };

  $scope.deleteTeam = function(i) {
    $scope.teams.splice(i, 1)[0].remove();
  };

  $scope.resetPairings = function() {
    $http.post('/reset_pairings').then(function() {
      $scope.pairings = [];
      $scope.$apply();
    });
  };

});
