angular.module('userAppNavbarDirective', []).directive('navDir', [ function(){
  // Runs during compile
  return {
    restrict: 'E',
    // name: '',
    // priority: 1,
    // terminal: true,
     scope: '=menuItems', // {} = isolate, true = child, false/undefined = no change
     controller: function($scope, $state, navbarFactory) {
       $scope.menuItems = navbarFactory.getNavbarHeadings();
       $scope.state = $state;
     },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // template: '',
     templateUrl: 'user/shared/navigation-bar/navigation-bar.html'
    // replace: true,
    // transclude: true,
    // compile:
  };
}]);