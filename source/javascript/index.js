var BetterContent = {};

BetterContent.config = {
    host: location.origin.replace(/^http/, 'ws')
}
BetterContent.App = function(){
    this.nativeConent = null;
    this.ws = null;
}

BetterContent.App.prototype.onMessage = function(event){
    console.log("Received Message");
    console.log(event);

    var nativeContent = JSON.parse(event.data);
    var contentClass = nativeContent.class;

    var elementsDiv = document.querySelector('#nativeContent')
    elementsDiv.innerHTML = '';
    for (var i = 0; i < nativeContent.length; i++) {
        var element = document.createElement('div');
        var frame = nativeContent[i].attributes.frame;
        var font = nativeContent[i].attributes.font;

        element.innerHTML = nativeContent[i].attributes.text;
        element.setAttribute('class', 'element');
        element.setAttribute('contenteditable', true);
        element.setAttribute("key", nativeContent[i].key);

        var positionStyle =
            "top:" + frame.Y + "px; left:" + frame.X + "px; width:" + frame.Width + "px; height:" + frame.Height + "px;" +
            "font-size:" + font.pointSize + "px;";
        element.setAttribute('style', positionStyle);
        elementsDiv.appendChild(element);

        element.addEventListener("input", function (event) {
            console.log(event.srcElement);
            sendLabel(event.srcElement);
        }, false);
    }

    var sendLabel = function (element) {
        var newLabelMap = [];
        var value = element.innerText;
        newLabelMap.push({'key': element.getAttribute('key'), 'attributes': {'text': value}});
        ws.send(JSON.stringify({'type': 'labelMap', 'data': newLabelMap}));
    }

}

BetterContent.App.prototype.onOpen = function() {
    this.ws.send(JSON.stringify({'type': 'register', 'data': 'webClient'}));
    this.keepAlive();
}

BetterContent.App.prototype.onClose = function() {
    // kill keepAlive
    var that = this;
    setTimeout(function () {
        that.setupWebsocket();
    }, 1000);
}

BetterContent.App.prototype.keepAlive = function(){
    var that = this;
    setTimeout(function () {
        that.ws.send(JSON.stringify({'type': 'ping'}));
        that.keepAlive();
    }, 5000);
}

BetterContent.App.prototype.setupWebSocket = function(){
    var that = this;
    this.ws = new WebSocket(BetterContent.config.host);
    this.ws.onmessage = this.onMessage;
    this.ws.onopen = function(event){ that.onOpen.call(that, event) };
    this.ws.onclose = this.onClose;
}

var BetterContentss = function(){
    var setupWebsocket = function() {
        ws = new WebSocket(host);

        var keepAlive = function () {
            setTimeout(function () {
                ws.send(JSON.stringify({'type': 'ping'}));
                keepAlive();
            }, 5000);
        }


        ws.onmessage = function (event) {
            console.log("Received Message");
            console.log(event);

            var nativeContent = JSON.parse(event.data);
            var contentClass = nativeContent.class;

            var elementsDiv = document.querySelector('#nativeContent')
            elementsDiv.innerHTML = '';
            for (var i = 0; i < nativeContent.length; i++) {
                var element = document.createElement('div');
                var frame = nativeContent[i].attributes.frame;
                var font = nativeContent[i].attributes.font;

                element.innerHTML = nativeContent[i].attributes.text;
                element.setAttribute('class', 'element');
                element.setAttribute('contenteditable', true);
                element.setAttribute("key", nativeContent[i].key);

                var positionStyle =
                    "top:" + frame.Y + "px; left:" + frame.X + "px; width:" + frame.Width + "px; height:" + frame.Height + "px;" +
                    "font-size:" + font.pointSize + "px;";
                element.setAttribute('style', positionStyle);
                elementsDiv.appendChild(element);

                element.addEventListener("input", function (event) {
                    console.log(event.srcElement);
                    sendLabel(event.srcElement);
                }, false);
            }
        };
        ws.onopen = function (event) {
            ws.send(JSON.stringify({'type': 'register', 'data': 'webClient'}));
            keepAlive();
        };

        ws.onclose = function (event) {
//            ws.send(JSON.stringify({'type': 'register', 'data': 'webClient'}));
            setTimeout(function () {
                setupWebsocket();
            }, 1000);
        };

        sendLabel = function (element) {
            var newLabelMap = [];
            var value = element.innerText;
            newLabelMap.push({'key': element.getAttribute('key'), 'attributes': {'text': value}});
            ws.send(JSON.stringify({'type': 'labelMap', 'data': newLabelMap}));
        }

//        sendLabels = function (form) {
//            var newLabelMap = [];
//            for (var i = 0; i < form.elements.length; i++) {
//                var key = form.elements[i].getAttribute('key')
//                if (key != null) {
//                    var value = form.elements[i].value;
//                    newLabelMap.push({'key': key, 'attributes': {'text': value}});
//                }
//            }
//            ws.send(JSON.stringify({'type': 'labelMap', 'data': newLabelMap}));
//        }
    }
    setupWebsocket();
};

var app = new BetterContent.App();
app.setupWebSocket();

//new BetterContentss();


