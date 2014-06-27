var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');
var BetterContentWebSocketServer= require('./app/BetterContentWSS');
var port = process.env.PORT || 5000;

var app = express();
app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);
console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');

var betterContentWSS = new BetterContentWebSocketServer(wss);
console.log('Better Content service started');
