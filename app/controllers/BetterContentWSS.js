function BetterContentWSS(webSocketServer) {
    var NATIVE_APP = 'nativeApp';
    var WEB_CLIENT = 'webClient';

    var wss = webSocketServer;

    var nativeSockets = {};
    var webClientSockets = {};
    var lastNativeMessages = {}

    wss.on('connection', function (ws) {
        ws.on('close', function () { webSocketClosed(ws) });
        ws.on('message', function (data, flags) {
            // flags.binary will be set if a binary data is received
            // flags.masked will be set if the data was masked
            var message = JSON.parse(data);

            if (message.type === 'register') { clientRegistered(ws, message.data); }
            if (message.type === 'ui') { clientMessaged(ws, message.data); }
            if (message.type === 'ping') { /*pong?*/ }
        });
    });

    function clientRegistered(webSocket, regInfo) {
        webSocket.appName = regInfo.appName;
        webSocket.appType = regInfo.app;

        if (regInfo.app === NATIVE_APP) {
            nativeSockets[regInfo.appName] = webSocket;
            console.log('Regitering listener for WebApp ' + regInfo.appName);
        }
        if (regInfo.app === WEB_CLIENT) {
            webClientSockets[regInfo.appName] = webSocket;
            console.log('Regitering listener for Native ' + regInfo.appName);
            if (lastNativeMessages[regInfo.appName]){
                webClientSockets[regInfo.appName].send(JSON.stringify(lastNativeMessages[regInfo.appName]));
            }
        }
    }

    function webSocketClosed(ws) {
        delete nativeSockets[ws.appName];
    }

    function clientMessaged(ws, message) {
        if (ws.appType == NATIVE_APP) {
            console.log('received message from native ' + JSON.stringify(message));
            lastNativeMessages[ws.appName] = message;
            if(webClientSockets[ws.appName]){
                webClientSockets[ws.appName].send(JSON.stringify(message));
            }
        }
        if (ws.appType == WEB_CLIENT) {
//            console.log('received message from webClient ' + JSON.stringify(message));
            console.log("**== mnative sokcet =" + nativeSockets[ws.appName]);
            if (nativeSockets[ws.appName]) {
                nativeSockets[ws.appName].send(JSON.stringify(message));
            }
        }
    }

    // exports    
    this.nativeSockets = nativeSockets;
}

module.exports = BetterContentWSS;

