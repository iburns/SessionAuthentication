var User = require('../models/User')
var crypto = require('crypto');
var express = require('express')
var router = express.Router();

// db connection
var con = require('../../db_connection.js')

router.post('/', function (req, res) {
  register({email: req.body.email, password: req.body.password}, function(result, err) {
    if (err) {
      res.send(err);
      return;
    }
    res.send(result);
  });
});

var register = function(login, callback) {
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

module.exports = router
