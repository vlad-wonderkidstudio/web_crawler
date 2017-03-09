angular.module('userAppLoginCtrl', [])

.controller('loginCtrl', ["$scope", "$state", "Auth", "User", function ($scope, $state, Auth, User) {
  $scope.login = function() {
    var credentials = {name: $scope.username, password: $scope.password};

    User.login(credentials).then(function (resp) {
      if (resp && resp.data && resp.data.success) {
        $scope.flash = {type: "success", message: "Login OK"};
        $state.go('home');
      } else {
        $scope.flash = {type: "error", message: "Login failed"};
      }
    });
  }
}]);
