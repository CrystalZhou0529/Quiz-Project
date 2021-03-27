var express = require('express');
var app = express();
var routes = require('./routes/index.js');
var path = require('path');
var port = process.env.PORT || 8080;

app.use('/', routes);

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