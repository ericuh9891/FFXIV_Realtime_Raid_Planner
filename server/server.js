// create express server
const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);

// socket.io setup
const { Server } = require('socket.io');
const io = new Server(server);

// socket.io event listeners
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('arena', (message) => console.log(message));
  /** Icon syncing between users */
  // icon spawn
  socket.on('iconSpawn', (icon) => {
    console.log(`User: ${socket.id} spawned a new icon:`);
    socket.broadcast.emit('iconSpawn', icon);
  });
  // icon move
  socket.on('iconMove', (movement) => {
    console.log(`User: ${socket.id} moved an icon`);
    socket.broadcast.emit('iconMove', movement);
  })
  // icon edit
  socket.on('iconEdit', (editedIcon) => {
    console.log(`User: ${socket.id} edited an icon`);
    socket.broadcast.emit('iconEdit', editedIcon);
  })
  // tells all other connected sockets to update their icons state
  // socket.on('iconsUpdate', (message) => socket.broadcast.emit('iconsUpdate', message));


  socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
});

// serve the dev build, change to production builds when ready
app.use(express.static('../client/build'));

// send react app
app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

const port = 8000
server.listen(port, () => {
  console.log(`Server is listening to port: ${port}`);
});