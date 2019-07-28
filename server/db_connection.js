var mysql = require('mysql');

module.exports = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "dbo"
});

// exports.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });
