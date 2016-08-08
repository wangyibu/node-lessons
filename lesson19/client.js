var net_1 = require('net');
var client = new net_1.Socket();
client.connect(7000, "127.0.0.1");
client.on('data', function (data) {
    console.log('Data: ' + data);
    client.destroy();
});
// Add a 'close' event handler for the client socket
client.on('close', function () {
    console.log('Connection closed');
});
//# sourceMappingURL=client.js.map