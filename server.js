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

app.post('/addSet', function(req, res) {
  var sql = "insert into vocab_set (setname) values (?)";
  // console.log(req.body);
  try {
    db.query(sql, respond, res, [req.body.setname]);
  } catch (err) {
    res.send("{error: error}");
  }
});

app.post('/getSet', function(req, res) {
  var sql = "select * from vocab_set";
  try {
    db.query(sql, respond, res);
  } catch (err) {
    res.send("error: error");
  }
});


app.post('/getWords', function(req, res) {
  // console.log(req.body);
  var sql = "SELECT * from words where setid = " + req.body.id;
  try {
    db.query(sql, respond, res);
  } catch (err) {
    res.send("{error: error}");
  }
});

app.post('/addWords', function(req, res) {
  // console.log(req.body);
  var sql = "insert into words (fr, en, success, fail, setid) values (?,?,?,?,?)";
  try {
    db.query(sql, respond, res, [req.body.fr, req.body.en, req.body.success, req.body.fail,
      req.body.setid
    ]);
  } catch (err) {
    res.send("{error: error}");
  }
});

app.post('/getSetId', function(req, res) {
  var sql = "SELECT * from vocab_set where setname = '" + req.body.setname + "'";
  try {
    db.query(sql, respond, res);
  } catch (err) {
    res.send("{error: error}");
  }
});