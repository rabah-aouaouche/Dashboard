var mysql = require("mysql2");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "631080",
  database: "SANTEVIE",
});

con.connect(function (err) {
  if (err) throw err; //not connected
  console.log("Connected!");
});

module.exports = con.promise();
