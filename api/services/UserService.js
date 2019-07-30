var User  = require('../models/User');
var UserController = require('../controllers/UserController');

class UserService {
  constructor () {
    this.userController = new UserController();
  }

  getUserById(id, callback) {
    this.userController.getUserById(id, function(result, err) {
        return callback(result, err);
    });
  }
}

module.exports = UserService;
