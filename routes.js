var routes = {};
var config = require('./config/settings.js');
routes.authManager = require('./lib/auth.manager.js');
routes.trips =  require('./trips/trips.js');
//routing scheme
module.exports = function(app, passport) {
  
  app.post('/authenticate', routes.authManager.authPost());
  app.get('/authenticate', passport.authenticate('jwt', { session: false }), routes.authManager.authGet());

  app.get( config.subdir+'/trips', routes.trips.getTrips());
  
};