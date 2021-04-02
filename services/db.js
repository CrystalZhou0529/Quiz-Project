var mysql = require('mysql');
var config = require('./config');

function query(sql, callback, res, params) {
  var connection = mysql.createConnection(config);
  // console.log(sql);
  connection.query(sql, params, function(error, results, fields) {
    if (error) throw error;
    // console.log(results);
    str = JSON.stringify(results);
    // console.log(str);
    callback(res, results);
  });
};

module.exports = {
  query
};

/*connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
    var data = "";
    connection.query(sql, function(err, result, fields) {
      if (err) throw err;
      console.log("Query: " + JSON.stringify(result));
      data = JSON.stringify(result);
      return data;
    });
  });*/