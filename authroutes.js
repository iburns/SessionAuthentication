const path = require('path');
const passport = require('passport');

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

  app.use('/api/register', passport.authenticate('local-register', { successRedirect : '/medirect', failureRedirect : '/register', failureFlash: true, successFlash: 'Welcome!' }));
  app.post('/api/login', passport.authenticate('local-login', { successRedirect : '/medirect', failureRedirect : '/login', failureFlash: true, successFlash: 'Welcome!' }));

  app.use('/medirect', isLoggedIn, function(req, res) {
    res.render('pages/me', { data: { messages: req.flash() }});
  })

  // login route
  app.get('/login', function(req, res) {
    res.render('pages/login', { data: { messages: req.flash() } });
  });

  // login route
  app.get('/register', function(req, res) {
    res.render('pages/register', { data: { messages: req.flash() } });
  });

  // login route
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
  res.redirect('/login');//path.join(__dirname, 'public') + '/login.html');
}

