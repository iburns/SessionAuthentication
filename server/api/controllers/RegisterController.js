var User = require('../models/User')
var crypto = require('crypto');

// db connection
var con = require('../../db_connection.js')

class RegisterController {

  register(login, callback) {
    var email = login.email;
    var pass = login.password;

    try {
      var salt = crypto.randomBytes(16).toString('hex').slice(0,16);
      var hash = crypto.pbkdf2Sync(pass, salt, 100, 64, `sha512`).toString(`hex`).slice(0,64);

      con.query('INSERT INTO dbo.Users VALUES (null, "username", ?, ?, ?)', [email, hash, salt], function (err, result) {
        if (err) throw err;

        return callback("Registration successful.", null);
      });

    } catch (e) {
        return callback(null, "error");
    }
  }
}

module.exports = RegisterController
