http = require('http');
fs = require('fs');
times = [];
page = function (){
    var html = '<html><body>\
        <form method="post" action="http://localhost:3000/resource">\
        <input type="text" name="name" />\
        <input type="text" name="id" />\
        <input type="submit" value="Submit" />\
        </form>';
    for(i=0;i<times.length;i++){
        html+=times[i]+'<br/>';
    }
    html += '</body>';
    return html
}

paths = {
    '/': function(req,res) {
    var id = req.socket.remoteAddress+':'+req.socket.remotePort
        req.addListener("data", function(chunk){
            req.content += chunk;
        });
        req.addListener("end", function(){
            console.log(req.content.replace(/&/g, ','));
        });
        res.writeHead(200, {'Content-Type': 'text/html','Access-Control-Allow-Origin': '*'});
        res.end(page());
    },
}

server = http.createServer( function(req, res) {
    req.content = '';
    if (!(req.url in paths))
        req.url = '/'
    paths[req.url].apply(this, [req,res]);
});

port = 3001;
host = '0.0.0.0';
server.listen(port, host);

folder = process.argv[2] || '/tmp/test'

process.on('SIGINT', function () {
    resultstring = '';
    for (i=0;i<times.length;i++){
        resultstring += times[i]+'\n';
    }
    fs.writeFileSync(folder, resultstring);
    process.exit(0);
});
