var labelsMap;
var host = location.origin.replace(/^http/, 'ws')
var ws;

var setupWebsocket = function(){
    ws = new WebSocket(host);

    var keepAlive = function(){
        setTimeout(function () {
            ws.send(JSON.stringify({'type':'ping'}));
            keepAlive();
        }, 5000);
    }


    ws.onmessage = function (event) {
        console.log("Received Message");
        console.log(event);
        labelsMap = JSON.parse(event.data);
        var elementsDiv = document.querySelector('#nativeContent')
        elementsDiv.innerHTML = '';
        for (var i = 0 ; i < labelsMap.length ; i++) {
            var element = document.createElement('div');
            var frame = labelsMap[i].attributes.frame;
            var font = labelsMap[i].attributes.font;

            element.innerHTML = labelsMap[i].attributes.text;
            element.setAttribute('class', 'element');
            element.setAttribute('contenteditable', true);
            element.setAttribute("key", labelsMap[i].key);

            var positionStyle =
                "top:" + frame.Y + "px; left:" + frame.X + "px; width:" + frame.Width + "px; height:" + frame.Height + "px;" +
                "font-size:" + font.pointSize + "px;";
            element.setAttribute('style', positionStyle);
            elementsDiv.appendChild(element);

            element.addEventListener("input", function(event) {
                console.log(event.srcElement);
                sendLabel(event.srcElement);
            }, false);
        }
    };
    ws.onopen = function (event) {
        ws.send(JSON.stringify({'type':'register', 'data':'webClient'}));
        keepAlive();
    };

    ws.onclose = function (event) {
        ws.send(JSON.stringify({'type':'register', 'data':'webClient'}));
        setTimeout(function () {
            setupWebsocket();
        }, 1000);
    };

    sendLabel = function(element){
        var newLabelMap = [];
        var value = element.innerHTML;
        newLabelMap.push({'key':element.getAttribute('key'), 'attributes':{'text':value}});
        ws.send(JSON.stringify({'type':'labelMap', 'data': newLabelMap}));
    }

    sendLabels = function(form){
        var newLabelMap = [];
        for (var i = 0 ; i < form.elements.length ; i++) {
            var key = form.elements[i].getAttribute('key')
            if (key != null){
                var value = form.elements[i].value;
                newLabelMap.push({'key':key, 'attributes':{'text':value}});
            }
        }
        ws.send(JSON.stringify({'type':'labelMap', 'data': newLabelMap}));
    }

}

setupWebsocket();
