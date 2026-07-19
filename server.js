const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {cors: {origin: "*"}});

let players = {};
io.on('connection', (socket) => {
  console.log('Player join:', socket.id);
  
  socket.emit('yourId', socket.id);
  socket.emit('allPlayers', players);
  
  players[socket.id] = {x:0, y:1, z:0};
  socket.broadcast.emit('newPlayer', {id: socket.id, x:0, y:1, z:0});

  socket.on('move', (data) => {
    players[socket.id] = data;
    socket.broadcast.emit('playerMoved', {id: socket.id, ...data});
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('playerLeft', socket.id);
  });
});

http.listen(process.env.PORT || 3000, () => console.log('Server jalan di port 3000'));
