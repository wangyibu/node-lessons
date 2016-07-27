import { createServer as createServer} from "net";

var server = createServer(function (socket) {
    console.log("Connection from " + socket.remoteAddress);
    socket.end("Hello World\n");
});

server.listen(7000, "127.0.0.1");
