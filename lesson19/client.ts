import {Socket as socket} from 'net';
var client = new socket();
client.connect(7000,"127.0.0.1");
client.on('data', function (data) {
    console.log('Data: ' + data);
    client.destroy();
});

// Add a 'close' event handler for the client socket
client.on('close', function () {
    console.log('Connection closed');
});
