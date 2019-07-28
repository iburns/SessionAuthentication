var express = require('express');
var cors = require ('cors');
var bodyparser = require('body-parser');

// services
var UserService = require('./api/services/UserService');
var userService = new UserService();
var RegisterService = require('./api/services/RegisterService');
var registerService = new RegisterService();
var LoginService = require('./api/services/LoginService');
var loginService = new LoginService();

// init app
var app = express();

// setup app
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.get('/', function (req, res) {
  res.send('Hello World!');
  console.log(con);
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

app.post('/register', function (req, res) {
  registerService.register({email: req.body.email, password: req.body.password}, function(result, err) {
    if (err) {
      res.send(err);
      return;
    }
    res.send(result);
  });
});


app.post('/login', function (req, res) {
  loginService.login({email: req.body.email, password: req.body.password}, function(result, err) {
    if (err) {
      res.send(err);
      return;
    }
    res.send(result);
  });
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
