var express = require('express');
var app = express();
var routes = require('./routes/index.js');
var path = require('path');
var bodyParser = require('bodyParser');
var port = process.env.PORT || 8080;

app.use('/', routes);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // this is used for parsing the JSON object from POST

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

var contactList = [{
    name: 'Bob',
    age: 12
  },
  {
    name: 'Anton',
    age: 30
  }
];

app.get('/test', function(req, res) {
  res.send(contactList);
});

app.get('/import', function(req, res) {
  res.sendFile(path.join(__dirname, "/public/import.html"));
})

app.get('/addContact', function(req, res) {
  for (var i in req.body) {
    console.log(i);
  }
  /*contactList.push({
    name: req.body.name,
    age: req.body.age
  });*/
  res.send(contactList);
})