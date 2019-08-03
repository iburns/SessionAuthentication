var mysql = require('mysql');
const config = require ('config');

// Get connection info from config
var connectionInfo = config.db;

module.exports = mysql.createConnection(connectionInfo);
