var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');
var BetterContentController = require('./controllers/BetterContentController');

var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/'));
var server = http.createServer(app);
server.listen(port);
console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');

var betterContent = new BetterContentController();
betterContent.registerListener(BetterContentController.NATIVE_APP, function(jsonMessage){
    if (webClient){
        webClient.send(JSON.stringify(jsonMessage));
    }
})
betterContent.registerListener(BetterContentController.WEB_CLIENT, function(jsonMessage){
    if (nativeApp){
        nativeApp.send(JSON.stringify(jsonMessage));
    }
})

var nativeApp = null;
var webClient = null;

wss.on('connection', function(ws) {
    console.log('websocket connection open');
    ws.on('close', function() {
        console.log('websocket connection close');
        if (ws === nativeApp){
            nativeApp = null;
        }
        if (ws === webClient){
            webClient = null;
        }
    });

    ws.on('message', function(data, flags) {
        // flags.binary will be set if a binary data is received
        // flags.masked will be set if the data was masked
        console.log('websocket received message ' + data);

        var message = JSON.parse(data);
        if (message.type === 'register'){
            if (message.data === BetterContentController.NATIVE_APP){
                nativeApp = ws;
            }
            if (message.data === BetterContentController.WEB_CLIENT){
                webClient = ws;
            }
        }

        if (message.type === 'labelMap'){
            if (ws == nativeApp){
                betterContent.onMessage(BetterContentController.WEB_CLIENT, message.data)
            }
            if (ws == webClient){
                betterContent.onMessage(BetterContentController.NATIVE_APP, message.data)
            }
        }
    });
});

