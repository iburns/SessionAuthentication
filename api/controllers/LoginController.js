var express = require('express')
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var router = express.Router();

// db connection
var con = require('../../db_connection.js')

router.post('/', function (req, res) {
  login({email: req.body.email, password: req.body.password}, function(result, err) {
    if (err) {
      res.send(err);
      return;
    }
    res.cookie('accesstoken', result.token, {signed: true});
    res.send({ success: true});
  });
});

var login = function(login, callback) {
  var email = login.email;
  var pass = login.password;

  try {
    con.query('SELECT Id, Hash, Salt FROM dbo.Users WHERE Email = ?', [email], function (err, result) {
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

        if (!result)
          return callback(false, null);
        
        var token = jwt.sign({id: info.Id}, process.env.SECRET, {expiresIn: 86400});

        return callback({ token: token }, null);
      });
    } catch (e) {
        // sql issue or something
        return callback(null, "error");
    }
  }


module.exports = router
