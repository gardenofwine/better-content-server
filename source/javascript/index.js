var labelsMap;
var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
ws.onmessage = function (event) {
    console.log("Received Message");
    console.log(event);
    labelsMap = JSON.parse(event.data);
    var elementsDiv = document.querySelector('#labels')
    elementsDiv.innerHTML = '';
//    document.querySelector('#labels').innerHTML = '';
    for (var i = 0 ; i < labelsMap.length ; i++) {
        var element = document.createElement('div');
        var frame = labelsMap[i].attributes.frame;
        element.innerHTML = labelsMap[i].attributes.text;
        element.setAttribute('class', 'element');
        element.setAttribute('contenteditable', true);
        var positionStyle = "top:" + frame.Y + "px; left:" + frame.X + "px; width:" + frame.Width + "px; height:" + frame.Height + "px;";
        element.setAttribute('style', positionStyle);
        elementsDiv.appendChild(element);
    }

//    for (var i = 0 ; i < labelsMap.length ; i++) {
//        var input = document.createElement('input');
//        input.setAttribute("type", "text");
//        input.setAttribute("value", labelsMap[i].attributes.text);
//        input.setAttribute("key", labelsMap[i].key);
//        input.setAttribute("class", "labelText");
//        var li = document.createElement('li');
//        li.appendChild(input);
//        document.querySelector('#labels').appendChild(li);
//    }
};
ws.onopen = function (event) {
    ws.send(JSON.stringify({'type':'register', 'data':'webClient'}));
    timeout();
    function timeout() {
        setTimeout(function () {
            ws.send(JSON.stringify({'type':'ping'}));
            timeout();
        }, 5000);
    }
};
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
