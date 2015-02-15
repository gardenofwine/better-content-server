var BetterContent = {};

BetterContent.config = {
    host: location.origin.replace(/^http/, 'ws'),
    nativeAppSize : null
}
BetterContent.App = function(){};

BetterContent.App.prototype.onMessage = function(event){
    console.log("Received Message");
    console.log(event);

    var nativeContent = JSON.parse(event.data);
    BetterContent.config.nativeAppSize = {"width": 320, "height":480}
    var elementsDiv = document.querySelector('#nativeContent')
    elementsDiv.innerHTML = '';
    for (var i = 0; i < nativeContent.length; i++) {
        var componentClass = nativeContent[i].attributes.class;
        var componentHandler = BetterContent.Components[componentClass];
        if (typeof componentHandler !== "undefined"){
            componentHandler.draw(nativeContent[i], elementsDiv);
        }
    }
}

BetterContent.App.prototype.onOpen = function() {
    this.ws.send(JSON.stringify({'type': 'register', 'data': {'app':'webClient', 'appName': bundleName}}));
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
        BetterContent.ws.send(JSON.stringify({'type': 'ping'}));
        that.keepAlive();
    }, 5000);
}

BetterContent.App.prototype.setupWebSocket = function(){
    var that = this;
    this.ws = new WebSocket(BetterContent.config.host);
    this.ws.onmessage = this.onMessage;
    this.ws.onopen = function(event){ that.onOpen.call(that, event) };
    this.ws.onclose = this.onClose;
    BetterContent.ws = this.ws;
}

BetterContent.Components = {}

BetterContent.Components.label = {
    draw: function(component, elementsDiv){
        if (component.attributes.hidden){
            return;
        }
        var element = document.createElement('div');
        var frame = component.attributes.frame;
        var font = component.attributes.font;

        element.innerHTML = component.attributes.text;
        element.setAttribute('class', 'btcElement');
        element.setAttribute('contenteditable', true);
        element.setAttribute("key", component.key);

        element.style.top = frame.Y + 'px';
        element.style.left = frame.X + 'px';
        element.style.width = frame.Width + 'px';
        element.style.height = frame.Height + 'px';
        element.style.fontSize = (font.pointSize * 0.85) + 'px';
        element.style.color = font.color;

        elementsDiv.appendChild(element);


        element.addEventListener("input", function (event) {
            sendLabel(event.srcElement);
        }, false);

        var sendLabel = function (element) {
            var newLabelMap = [];
            var value = element.innerText;
            newLabelMap.push({'key': element.getAttribute('key'), 'attributes': {'text': value}});
            BetterContent.ws.send(JSON.stringify({'type': 'ui', 'data': newLabelMap}));
        };
    }
}

BetterContent.Components.image = {
    draw: function (component, elementsDiv) {
        if (component.attributes.hidden || component.attributes.image === ""){
            return;
        }
        var element = new Image();
        element.src = 'data:image/png;base64,' + component.attributes.image;
        var frame = component.attributes.frame;

        element.setAttribute('class', 'btcElement image');
        element.setAttribute("key", component.key);

        element.style.top = frame.Y + 'px';
        element.style.left = frame.X + 'px';
        element.style.width = frame.Width + 'px';
        element.style.height = frame.Height + 'px';
        elementsDiv.appendChild(element);
    }
}

var app = new BetterContent.App();
app.setupWebSocket();


