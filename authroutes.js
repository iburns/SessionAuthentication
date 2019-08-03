const path = require('path');
const passport = require('passport');

const defaultRedirect = '/me';

module.exports = function(app) {
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

  app.use('/api/register', passport.authenticate('local-register', { successRedirect : defaultRedirect, failureRedirect : '/register', failureFlash: true, successFlash: 'Welcome!' }));
  app.post('/api/login', passport.authenticate('local-login', { successRedirect : defaultRedirect, failureRedirect : '/login', failureFlash: true, successFlash: 'Welcome!' }));

  app.use('/me', isLoggedIn, function(req, res) {
    res.render('pages/me', { data: { messages: req.flash() }});
  })

  // login route
  app.get('/login', isNotLoggedIn, function(req, res) {
    res.render('pages/login', { data: { messages: req.flash() } });
  });

  // register route
  app.get('/register', isNotLoggedIn, function(req, res) {
    res.render('pages/register', { data: { messages: req.flash() } });
  });

  // logout route
  app.use('/logout', function(req, res) {
    console.log("LOGOUT: \"" + req.user.Username + "\" (Id: " + req.user.Id + ") has logged out.")
    req.logout();
    res.redirect('/login');
  });
}

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');
}

//route middleware to ensure user is not logged in
function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated())
      return next();
  res.redirect(defaultRedirect);
}

