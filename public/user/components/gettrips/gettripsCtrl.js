angular.module('userAppGettripsCtrl', [])

.controller('gettripsCtrl', ['$http', '$scope', 'GettripsContent', 'Auth',  function($http, $scope, gettripsContent, Auth){

}])

.config(function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('DD.MM.YYYY');
  };
});
