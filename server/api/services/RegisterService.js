var User  = require('../models/User');
var RegisterController = require('../controllers/RegisterController');

class RegisterService {
  constructor () {
    this.registerController = new RegisterController();
  }

  register(login, callback) {
    this.registerController.register(login, function(result, err) {
        return callback(result, err);
    });
  }
}

module.exports = RegisterService;
