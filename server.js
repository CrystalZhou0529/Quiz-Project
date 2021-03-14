var http = require('http');
var srvr = http.createServer(function (req, res) {
  res.write('Hello World!');
  res.end();
});
srvr.listen(8080);
srvr.close();