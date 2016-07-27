"use strict";
var net_1 = require("net");
var server = net_1.createServer(function (socket) {
    console.log("Connection from " + socket.remoteAddress);
    socket.end("Hello World\n");
});
server.listen(7000, "127.0.0.1");
//# sourceMappingURL=server.js.map