const path = require('path');
const passport = require('passport');

module.exports = function(app) {

  // setup passport
  

  // api routes
  app.get('/api/user', function (req, res) {
    userService.getUserById(1, function(user, err) {
      if (err) {
        res.send(err);
        return;
      }
      res.send(user);
    });
  });

  app.use('/api/register', passport.authenticate('local-register', { successRedirect : '/me', failureFlash: true }));
  app.post('/api/login', passport.authenticate('local-login', { successRedirect : '/me', failureRedirect : '/login', failureFlash: true }));

  // login route
  app.get('/login', function(req, res) {
    res.render('pages/login', { data: { messages: req.flash() } });
  });

  // login route
  app.get('/register', function(req, res) {
    res.render('pages/register');
  });

  // login route
  app.use('/logout', function(req, res) {
    console.log("LOGOUT: \"" + req.user.Username + "\" (Id: " + req.user.Id + ") has logged out.")
    req.logout();
    res.redirect('/login');
  });
}