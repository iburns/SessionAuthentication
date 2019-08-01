var crypto = require('crypto');
var LocalStrategy   = require('passport-local').Strategy;

// db connection
var con = require('./db_connection.js')

module.exports = function(passport) {
	// =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.Id); // serializes the id
  });

  // used to deserialize the user (get's user info from Id)
  passport.deserializeUser(function(id, done) {
    con.query('SELECT Email, Username FROM dbo.Users WHERE Id = ?', [id], function (err, result) {
      if (err) {
        return done(err);
      }

      // no user found with given info
      if (result.length < 1)
        return done(null, false, { message: 'Invalid token. Please login again.' });

      // get the db info
      var info = result[0];
      
      return done(null, { Id: id, Email: info.Email, Username: info.Username});
    });
  });
	

 	// =========================================================================
  // LOCAL SIGNUP
  // =========================================================================
  passport.use('local-register', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
    function(req, email, password, done) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    con.query("select * from dbo.Users where Email = '"+email+"'",function(err,rows){
      if (err) done(err);
      if (rows.length) {
        return done(null, false, { message: 'That email is already registered.' });
      } else {
        // if there is no user with that email
        // create the user
        var usr = new Object();
        try {
          var salt = crypto.randomBytes(16).toString('hex').slice(0,16);
          var hash = crypto.pbkdf2Sync(password, salt, 100, 64, `sha512`).toString(`hex`).slice(0,64);
      
          con.query('INSERT INTO dbo.Users VALUES (null, "username", ?, ?, ?)', [email, hash, salt], function (err, result) {
            if (err) return done(err);
            usr.Id = result.insertId;
            return done(null, usr); // return the new users id
          });
        } catch (e) {
          console.log('error in try');
            return done(e);
        }
      }
    });
  }));

  // =========================================================================
  // LOCAL LOGIN
  // =========================================================================
  passport.use('local-login', new LocalStrategy({
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    try {
      con.query('SELECT Id, Username, Hash, Salt FROM dbo.Users WHERE Email = ?', [email], function (err, result) {
          if (err) {
            return done(err);
          }

          // no user found with given info
          if (result.length < 1)
            return done(null, false, { message: 'Incorrect email or password.' });

          // get the db info
          var info = result[0];

          // hash the given pass with the stored salt
          var hash = crypto.pbkdf2Sync(password, info.Salt, 100, 64, `sha512`).toString(`hex`).slice(0,64);

          // check for equivalence
          var result = (hash === info.Hash);

          if (!result)
            return done(null, false, { message: 'Incorrect email or password.' });
          
          console.log("LOGIN: \"" + info.Username + "\" (Id: " + info.Id + ") has logged in")
          return done(null, { Id: info.Id });
        });
      } catch (e) {
          // sql issue or something
          return done(null, false, { message: 'An error occured.' });
      }
    }));
};