var io = require('socket.io')();

connections = [];

io.on('connection', function(socket) {
    connections.push(socket);
    console.log("User connected: %s socket(s) connected", connections.length);

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log("User disconnected: %s socket(s) connected", connections.length);
    });
});

module.exports = io;