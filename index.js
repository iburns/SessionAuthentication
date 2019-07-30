var express = require('express');
var session = require('express-session');
var path = require('path');
var PORT = process.env.PORT || 5000;
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken');
var middleware = require('./middleware');
//var cookieParser = require('cookie-parser')
var passport = require('passport');
var passportConfig = require('./passport');
const dotenv = require('dotenv');
dotenv.config();

// init app
var app = express();
// setup app
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

// setup passport
passportConfig(passport);
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

// services
var UserService = require('./api/services/UserService');
var userService = new UserService();
var registerController = require('./api/controllers/RegisterController');
var loginController = require('./api/controllers/LoginController');

//app.use(cookieParser(process.env.SECRET));

// this would serve ALL the files... probably don't want that...
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

// get port in html files for AJAX
app.use('/constants', function(req, res) {
  res.send("var port='" + process.env.PORT + "'");
});

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
app.use('/api/register', registerController);

app.post('/api/login', passport.authenticate('local-login', { successRedirect : '/me' }));

// login route
app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, 'public') + '/login.html');
});

// login route
app.use('/logout', function(req, res) {
  console.log("LOGOUT: \"" + req.user.Username + "\" (Id: " + req.user.Id + ") has logged out.")
  req.logout();
  res.redirect('/login');
});

// game route AUTHENTICATED
app.use('/game', isLoggedIn, function(req, res) {
  res.sendFile(path.join(__dirname, 'public') + '/login.html');
});

// me route AUTHENTICATED
app.get('/me', isLoggedIn, function(req, res) {
  res.sendFile(path.join(__dirname, 'public') + '/me.html');
});

//  404 error
//  if we are here then the specified request is not found
app.use(function (req, res, next) {
  res.status(404).send("404: Sorry can't find that!")
})

//  500 error
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('500: Something broke!')
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

//route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/login');//path.join(__dirname, 'public') + '/login.html');
}

