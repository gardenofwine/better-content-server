var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');
var BetterContentWebSocketServer= require('./controllers/BetterContentWSS');
var port = process.env.PORT || 5000;

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + "/views");

app.use(express.static('wwwroot'));

app.get('/:bundleName', function(req, res){
    var bundleName = req.params.bundleName;
    res.render('appPage', { bundleName: bundleName });
})

var server = http.createServer(app);
var wss = new WebSocketServer({server: server});
var betterContentWSS = new BetterContentWebSocketServer(wss);
server.listen(port);
console.log('Better Content service started on port %d', port);
