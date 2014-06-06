var WebSocketServer = require('ws').Server
  , http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log('http server listening on %d', port);

var wss = new WebSocketServer({server: server});
console.log('websocket server created');

var nativeApp = null;
var webClient = null;

wss.on('connection', function(ws) {
    console.log('websocket connection open');

    ws.on('close', function() {
        console.log('websocket connection close');
        if (ws == nativeApp){
            nativeApp = null;
        }
        if (ws == webClient){
            webClient = null;
        }
    });

    ws.on('message', function(data, flags) {
        // flags.binary will be set if a binary data is received
        // flags.masked will be set if the data was masked
        console.log('websocket received message ' + data);
        var message = JSON.parse(data);
        if (message.type == 'register'){
            if (message.data == 'nativeApp'){
                nativeApp = ws;
            }
            if (message.data == 'webClient'){
                webClient = ws;
            }
        }

        if (message.type == 'labelMap'){
            if (ws == nativeApp){
                if (webClient){
                    webClient.send(JSON.stringify(message.data));
                }
            }
            if (ws == webClient){
                if (nativeApp){
                    nativeApp.send(JSON.stringify(message.data));
                }
            }

        }
    });
});

