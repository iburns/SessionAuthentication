var express = require('express');
var cors = require ('cors');
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('./config');
var middleware = require('./middleware');

// services
var UserService = require('./api/services/UserService');
var userService = new UserService();
var registerController = require('./api/controllers/RegisterController');
var loginController = require('./api/controllers/LoginController');

// init app
var app = express();

// setup app
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/user', function (req, res) {
  userService.getUserById(1, function(user, err) {
    if (err) {
      res.send(err);
      return;
    }
    res.send(user);
  });
});

app.use('/register', registerController);

app.use('/login', loginController);

app.get('/me', middleware.checkToken, function(req, res) {
  res.status(200).send("you got here");
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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
