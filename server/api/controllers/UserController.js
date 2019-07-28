var User = require('../models/User')

// db connection
var con = require('../../db_connection.js')

class UserController {

  // Gets the first user in the db
  getUserById(id, callback) {
    try {
    con.query('SELECT * FROM dbo.Users WHERE Id = ?', [id], function (err, result) {
          if (err) throw err;

          if (result.length < 1)
            return callback(null, "no entries with specified id");

          var user = result[0];
          var usr = new User({
            id: user.ID,
            username: user.Username,
            email: user.Email,
            hash: user.Hash,
            salt: user.Salt
          });
          return callback(usr, null);
        });
      } catch (e) {
          return callback(null, "error");
      }
  }

}

module.exports = UserController
