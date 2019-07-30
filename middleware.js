var jwt = require('jsonwebtoken');

module.exports = {
  checkToken(req, res, next) {
    var token = req.signedCookies.accesstoken;
    if (!token) res.redirect('/login');//return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) res.redirect('/login');//return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      next();
    });
  }
}