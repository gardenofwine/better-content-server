var BetterContentController = require('./BetterContentController');

function BetterContentWSS(webSocketServer) {
    var wss = webSocketServer;
    var betterContent = new BetterContentController();

    var nativeApp = null;
    var webClient = null;

    var lastClientMessage = null

    wss.on('connection', function (ws) {
        console.log('websocket connection open');
        ws.on('close', function () { webSocketClosed(ws) });

        ws.on('message', function (data, flags) {
            // flags.binary will be set if a binary data is received
            // flags.masked will be set if the data was masked
            var message = JSON.parse(data);

            if (message.type === 'register') { clientRegistered(ws, message.data); }
            if (message.type === 'labelMap') { clientMessaged(ws, message.data); }
            if (message.type === 'ping') { /*pong?*/ }
        });
    });

    function clientRegistered(webSocket, message) {
        if (message === BetterContentController.NATIVE_APP) {
            nativeApp = webSocket;
            console.log('Regitering listener for WebApp');
            betterContent.registerListener(BetterContentController.WEB_CLIENT, function (jsonMessage) {
                console.log('web client message listener');
                nativeApp.send(JSON.stringify(jsonMessage));
            })

            if (lastClientMessage !== null) {
                nativeApp.send(JSON.stringify(lastClientMessage));
            }
        }
        if (message === BetterContentController.WEB_CLIENT) {
            webClient = webSocket;
            console.log('Regitering listener for Native');
            betterContent.registerListener(BetterContentController.NATIVE_APP, function (jsonMessage) {
                console.log('native app message listener');
                webClient.send(JSON.stringify(jsonMessage));
            })
            if (lastClientMessage !== null) {
                webClient.send(JSON.stringify(lastClientMessage));
            }
        }
    }

    function webSocketClosed(ws) {
        if (ws === nativeApp) {
            console.log('Native websocket connection close');
            nativeApp = null;
            betterContent.removeListener(BetterContentController.WEB_CLIENT);
        }
        if (ws === webClient) {
            console.log('WebClient websocket connection close');
            webClient = null;
            betterContent.removeListener(BetterContentController.NATIVE_APP);
        }
    }

    function clientMessaged(client, message) {
        if (client == nativeApp) {
            console.log('received message from native ' + JSON.stringify(message));
            betterContent.onMessage(BetterContentController.NATIVE_APP, message);
            lastClientMessage = message;
        }
        if (client == webClient) {
            console.log('received message from webClient ' + JSON.stringify(message));
            betterContent.onMessage(BetterContentController.WEB_CLIENT, message);
        }
    }
}

module.exports = BetterContentWSS;

