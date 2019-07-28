var User = require('../models/User')
var crypto = require('crypto');

// db connection
var con = require('../../db_connection.js')

class LoginController {

  login(login, callback) {
    var email = login.email;
    var pass = login.password;

    try {
      con.query('SELECT Hash, Salt FROM dbo.Users WHERE Email = ?', [email], function (err, result) {
          if (err) throw err;

          // no user found with given info
          if (result.length < 1)
            return callback(null, "invalid email");

          // get the db info
          var info = result[0];

          // hash the given pass with the stored salt
          var hash = crypto.pbkdf2Sync(pass, info.Salt, 100, 64, `sha512`).toString(`hex`).slice(0,64);

          // check for equivalence
          var result = (hash === info.Hash);

          return callback(result, null);
        });
      } catch (e) {
          // sql issue or something
          return callback(null, "error");
      }
    }
}

module.exports = LoginController
