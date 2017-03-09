angular.module('userAppHomeCtrl', []).controller('homeCtrl', ['$scope', 'homeContent', function($scope, homeContent){
  $scope.dataset = homeContent.getContent();
  $scope.header = homeContent.getHeader();
 
}]);