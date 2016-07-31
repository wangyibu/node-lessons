import { createServer as createServer} from "net";

var server = createServer( socket =>{
    console.log("Connection remoteAddress from : " + socket.remoteAddress);
    console.log("Connection remoteFamily from : " + socket.remoteFamily);
    console.log("Connection remotePort from : " + socket.remotePort);
    console.log("Connection localAddress from : " + socket.localAddress);
    console.log("Connection localPort from : " + socket.localPort);
    console.log("Connection bytesRead from : " + socket.bytesRead);
    console.log("Connection bytesWritten from : " + socket.bytesWritten);
    socket.end("Hello World\n");
});

server.listen(7000, "127.0.0.1");
