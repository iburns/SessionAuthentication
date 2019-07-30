function User(user) {
  this.id = user.id;
  this.username = user.username;
  this.email = user.email;
  this.hash = user.hash;
  this.salt = user.salt;
}

User.prototype.getUsername = function() {
  return this.username;
}

User.prototype.getEmail = function() {
  return this.email;
}

module.exports = User;
