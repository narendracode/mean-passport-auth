var index = require('../routes/index');
var auth = require('../routes/auth')
module.exports = function (app){
      app.use('/', index);
      app.use('/auth',auth);
}
