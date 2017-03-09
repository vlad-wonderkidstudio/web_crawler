angular.module('userAppApiguiCtrl', [])

.controller('apiguiCtrl', ['$http', '$scope', 'apiguiContent', 'Auth', 'User',  function($http, $scope, apiguiContent, Auth, User){
  $scope.stops = apiguiContent.getStops();
  $scope.travelDate = new Date();
  $scope.minDate = new Date();

  $scope.addNewPassenger = function() {
    var newItemNo = $scope.passengers.length+1;
    $scope.passengers.push({type: 'Adult', discounts:[]});
  };
    
  $scope.removePassenger = function() {
    var lastItem = $scope.passengers.length-1;
    $scope.passengers.splice(lastItem);
  };


  $scope.submit = function() {
    var start = new Date().getTime();
    var url = location.protocol + "//" + location.host + "/trips";
    url += "?dep_ident=" + $scope.departure;
    url += "&arr_ident=" + $scope.arrival;
    url += "&date=" + moment($scope.travelDate).format('DD.MM.YYYY');
    $scope.test = "Wait for Loading!!!!!";


    var token = Auth.getToken();
    $http({
      method: 'GET',
      url: url,
      headers: {
       'Authorization': "Bearer " + token
      }
    }).then(function(res) {
      $scope.parsetime = "Search time: " + (new Date().getTime() - start) + " ms";
      $scope.url = url;
      $scope.result = res;
      $scope.test = '';
    },function(err) {
      $scope.error = true;
    }).finally(function() {
      
      $scope.parsetime = "Search time: " + (new Date().getTime() - start) + " ms";
      $scope.loading = false;
    });
  }  
}])

.config(function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('DD.MM.YYYY');
  };
});
