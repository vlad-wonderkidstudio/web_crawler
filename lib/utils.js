var moment = require('moment');

exports.getMonthDate = function(dt){
  var now = moment();
  if (dt)
    now = moment(dt);
  now.utc();
  return now.startOf('month').toDate();
};

exports.getDayDate = function(dt){
  var now = moment();
  if (dt)
    now = moment(dt);
  now.utc();
  return now.startOf('day').toDate();
};
