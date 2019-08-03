var expect = require('chai').expect;
var app = require('../index');
var request = require('supertest');

const userCredentials = {
  email: 'test', 
  password: 'test'
}

//now let's login the user before we run any tests
var authenticatedUser = request.agent(app);
before(function(done){
  authenticatedUser
    .post('/api/login')
    .send(userCredentials)
    .end(function(err, response){
      expect(response.statusCode).to.equal(302);
      expect('Location', '/me');
      done();
    });
});

//
// /login
//
describe('GET /login', function(done){
  it('should let anyone not logged in view', function(done){
    request(app).get('/login')
    .expect(200, done);
  });
  
  it('should redirect already authenticated user', function(done){
    authenticatedUser.get('/login')
    .expect(302, done);
  });
});

//
// /me
//
describe('GET /me', function(done){
  it('should return a 200 response if the user is logged in', function(done){
    authenticatedUser.get('/me')
    .expect(200, done);
  });

  it('should return a 302 response and redirect to /login', function(done){
    request(app).get('/me')
    .expect('Location', '/login')
    .expect(302, done);
  });
});