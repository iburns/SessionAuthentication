const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const bodyparser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./passport');
const flash = require('connect-flash');
const config = require('config');

const authcontroller = require('./authroutes');

// setup ENV variables for local builds
const dotenv = require('dotenv');
dotenv.config();

console.log('Running in ' + (process.env.NODE_ENV || 'default') + ' environment.');

// init app
var app = express();
// setup app
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

// setup view engine
app.set('view engine', 'ejs');

// session & passport setup
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: false}));
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Setup Auth Routes
authcontroller(app);

app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

// get port in html files for AJAX
app.use('/constants', function(req, res) {
  res.send("var port='" + process.env.PORT + "'");
});

// game route AUTHENTICATED
app.use('/game', isLoggedIn, function(req, res) {
  res.sendFile(path.join(__dirname, 'public') + '/login.html');
});

// me route AUTHENTICATED
app.get('/me', isLoggedIn, function(req, res) {
  res.render('pages/me');
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

module.exports = app;
