var app = angular.module('userAppRouter', ['ui.router']);

app

.service ("Auth", ["$window", function ($window) {
  var self = this;

  // Add JWT methods here
  self.parseJwt = function(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  }

  self.saveToken = function(token) {
    $window.localStorage['jwtToken'] = token;
  }

  self.getToken = function() {
    return $window.localStorage['jwtToken'];
  }

  self.isAuthed = function() {
    var token = self.getToken();
    if (token && (token.indexOf('.') != -1)) {
      var params = self.parseJwt(token);
      return (Math.round(new Date().getTime() / 1000) <= params.exp);
    } else {
      return false;
    }
  }

  self.isAdmin = function() {
    var token = self.getToken();
    if (token && (token.indexOf('.') != -1)) {
      var params = self.parseJwt(token);
      if (params.role == "admin")
        return (Math.round(new Date().getTime() / 1000) <= params.exp);
      else
        return false;
    } else {
      return false;
    }
  }

  self.logout = function() {
    $window.localStorage.removeItem('jwtToken');
  }
}])

.service ("User", ["$http", "Auth", function ($http, Auth) {
  var self = this;
  self.getQuote = function() {
    var token = Auth.getToken();
    return $http({method: 'GET', url: '/authenticate', headers: {'Authorization': "Bearer " + token}});
  }

  self.login = function(credentials) {
  return $http.post('/authenticate', credentials)
    .then(function(res) {
      Auth.saveToken(res.data.token);
      return res;
    });
  }

}])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
    .state('/', {
      url: '/',
      templateUrl: 'user/components/home/partial-home.html',
      resolve: {
        auth: ["$q", "Auth", AuthFun]
      }
    })

    .state('home', {
      url: '/home',
      templateUrl: 'user/components/home/partial-home.html',
      resolve: {
        auth: ["$q", "Auth", AuthFun]
      }
    })

    .state('ApiGUI', {
      url: '/ApiGUI',
      templateUrl: 'user/components/apigui/apigui.html',
      resolve: {
      auth: ["$q", "Auth", AuthFun]
      }
    })

    // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
    .state('About', {
      url: '/About',
      templateUrl: 'user/components/about/about.html'
    })

    // LOGIN PAGE ======================================================
    .state('Login', {
      url: '/Login',
      templateUrl: 'user/components/login/login.html',
      hideNavbar: true
    })

    .state('Logout', {
      url: '/Logout',
      controller: function($state, Auth) {
        Auth.logout();
        $state.go('Login');
      }
    })

    .state('Gettrips',{
      
    url: '/Gettrips',
    templateUrl: 'user/components/gettrips/gettrips.html'/*,
    controller: function (req, res, next) {
  console.log('the response will be sent by the next function ...');
  }*/
  }
    );

})

.run(["$rootScope", "$state", function($rootScope, $state) {
  $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
  });

  $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
    if (error && error.authenticated === false) {
      $state.go('Login');
    }
  });
}]);

var AuthFun = function ($q, Auth) {
  var info = Auth.isAuthed();
  info=true; //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  if (info)
    return $q.when(info);
  else
    return $q.reject({authenticated: false});
}