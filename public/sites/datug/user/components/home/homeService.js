angular.module('userAppHomeService', [])

.factory('homeContent', function(){
  return {
    getHeader: function(){
      return "User Panel";
    },
    getContent: function(){
      var content = [
      ];
      return content;
    }
  };
});