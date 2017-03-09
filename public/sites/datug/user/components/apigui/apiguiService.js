angular.module('userAppApiguiService', [])

.factory('apiguiContent', function(){
  return {
    getStops: function(){
      /*return [
        {name: "Aachen Hbf", id: 8000001},
        {name: "Wien Hbf", id: 1290401},
        {name: "Innsbruck Hbf", id: 8100108},
        {name: "Graz Hbf", id: 8100173},
        {name: "Salzburg Hbf", id: 8100002},
        {name: "Wien Westbahnhof", id: 1291501},
        {name: "Annabichl (Klagenfurt)", id: 1120109},
        {name: "Linz/Donau Hbf", id: 8100013}
      ];*/
      return [{name: "Bern", id: 8507000}, {name: "Aadorf", id: 8506013}];
    }
  };
});