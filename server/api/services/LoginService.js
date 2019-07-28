var User  = require('../models/User');
var LoginController = require('../controllers/LoginController');

class LoginService {
  constructor () {
    this.loginController = new LoginController();
  }

  login(login, callback) {
    this.loginController.login(login, function(result, err) {
        return callback(result, err);
    });
  }
}

module.exports = LoginService;
