var BetterContentController = require('./BetterContentController');

function BetterContentWSS(webSocketServer) {
    var wss = webSocketServer;
    var betterContent = new BetterContentController();

    var nativeApp = null;
    var webClient = null;

    var lastNativeMessage = null;
    var lastWebClientMessage = null;

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
            betterContent.registerListener(BetterContentController.WEB_CLIENT, function (jsonMessage) {
                console.log('web client message listener');
                nativeApp.send(JSON.stringify(jsonMessage));
            })

            if (lastWebClientMessage !== null) {
                nativeApp.send(JSON.stringify(lastWebClientMessage));
            }
        }
        if (message === BetterContentController.WEB_CLIENT) {
            webClient = webSocket;
            betterContent.registerListener(BetterContentController.NATIVE_APP, function (jsonMessage) {
                console.log('native app message listener');
                webClient.send(JSON.stringify(jsonMessage));
            })
            if (lastNativeMessage!== null) {
                webClient.send(JSON.stringify(lastNativeMessage));
            }
        }
    }

    function webSocketClosed(ws) {
        console.log('websocket connection close');
        if (ws === nativeApp) {
            nativeApp = null;
            betterContent.removeListener(BetterContentController.NATIVE_APP);
        }
        if (ws === webClient) {
            webClient = null;
            betterContent.removeListener(BetterContentController.WEB_CLIENT);
        }
    }

    function clientMessaged(client, message) {
        console.log('websocket received message ' + JSON.stringify(message));
        if (client == nativeApp) {
            lastNativeMessage = message;
            betterContent.onMessage(BetterContentController.NATIVE_APP, message);
        }
        if (client == webClient) {
            lastWebClientMessage = message;
            betterContent.onMessage(BetterContentController.WEB_CLIENT, message);
        }
    }
}

module.exports = BetterContentWSS;

