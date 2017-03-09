angular.module('userAppNavbarService', [])

.factory('navbarFactory', [function(){
  return{
    getNavbarHeadings: function(){
      var headings = [
      {
        title: 'ApiGUI'
      },
      {
        title: 'About'
      }
      ];
      return headings;
    }
  };
}])