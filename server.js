var express = require('express');
var app = express();
var routes = require('./routes/index.js');
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

var db = require('./services/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);
app.use(express.static(__dirname + '/public'));

// app.use(express.static(__dirname));

// routes

/*app.get('/', function(req, res) {
  res.render("index");
});*/

app.listen(port, function(err) {
  if (err) throw err;
  console.log(`app running at: ${port}`);
});

app.set('views', path.join(__dirname, 'public'));


app.get('/test', function(req, res) {
  res.send(contactList);
});

app.get('/import', function(req, res) {
  res.sendFile(path.join(__dirname, "/public/import.html"));
})

function respond(res, output) {
  res.send(output);
}

app.post('/searchVocab', function(req, res) {
  var sql = "SELECT * FROM test";
  try {
    db.query(sql, respond, res);
  } catch (err) {
    res.send("{error: error}");
  }
});