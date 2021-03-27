$("#sqlTest").click(function() {
  var mysql = require('mysql');
  var config = require('./config');
  var connection = mysql.createConnection(config);

  var sql = "SELECT * FROM customers";

  connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    connection.query(sql, function(err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });
})