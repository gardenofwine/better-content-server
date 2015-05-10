var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');
var BetterContentWebSocketServer= require('./controllers/BetterContentWSS');
var port = process.env.PORT || 5000;

var app = appSetup(express());

app.get('/', function (req, res) {
  var protocol = req.secure ? 'https' : 'http'; 
  res.render('index', { 
    nativeSockets: betterContentWSS.nativeSockets, 
    host: protocol + '://' + req.headers.host});
});

app.param('bundleName', /.*[^\/]/);
app.get('/:bundleName', function(req, res){
    var bundleName = req.params.bundleName;
    res.render('appPage', { bundleName: bundleName});
})

app.use(express.static('wwwroot'));

var server = http.createServer(app);
var wss = new WebSocketServer({server: server});
var betterContentWSS = new BetterContentWebSocketServer(wss);
server.listen(port);
console.log('Better Content service started on port %d', port);

function appSetup(app){
  app.set('view engine', 'jade');
  app.set('views', __dirname + "/views");
  app.param(function(name, fn) {
    if (fn instanceof RegExp) {
      return function(req, res, next, val) {
        var captures;
        if (captures = fn.exec(String(val))) {
          req.params[name] = captures;
          next();
        } else {
          next('route');
        }
      }
    }
  });
  return app;
}