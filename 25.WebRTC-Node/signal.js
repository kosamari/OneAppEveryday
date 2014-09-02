var io = require('socket.io').listen(9001);

console.log("listening on port 9001...");
 
io.sockets.on('connection', function(socket) {
  socket.on('message', function(message) {
    socket.broadcast.emit('message', message);
  });
 
  socket.on('disconnect', function() {
    socket.broadcast.emit('disconnected');
  });
});