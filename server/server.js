// create express server
const express = require('express');
const app = express();
const http = require('http');
const { REPL_MODE_SLOPPY } = require('repl');

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

// list of rooms, room should be added only when a socket joins/creates the room
const roomList = new Set();

// room id generator, will check roomList for a generated id colision and rerun
function roomIdGenerator() {
  // controls the size of hex room id by number of 0s in hex multiplier
  const roomIdLength = 0x10000
  // generates a hex room id 
  let newRoomId = null
  do {
    newRoomId = Math.floor((1 + Math.random()) * roomIdLength)
    .toString(16)
    .substring(1);
  } while (roomList.has(newRoomId));
  return newRoomId;
};

/*** Express routing */

app.get('/room/:room', (req, res) => {
  if (roomList.includes(req.params.room)){
    res.send(`Room: ${req.params.room}`);
  } else {
    res.send('No such room');
  }
});

// send react app
app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

const port = 8000
server.listen(port, () => {
  console.log(`Server is listening to port: ${port}`);
});