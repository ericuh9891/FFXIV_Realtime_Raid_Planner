// create express server
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const server = http.createServer(app);

// socket.io setup
const { Server } = require('socket.io');
const io = new Server(server);

// finds the first room the socket belongs to, 
// should be fine for my use case as each user should only be in one room
function findRoomId(socket) {
  console.log("Entering findRoomId function");
  let room = null;
  socket.rooms.forEach( (element) => {
    if (element != socket.id){
      room = element;
    };
  });
  console.log(`Returning ${room}`);
  return room;
};

// socket.io event listeners
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('arena', (message) => console.log(message));
  /** Icon syncing between users */
  // icon spawn
  socket.on('iconSpawn', (icon) => {
    console.log(`User: ${socket.id} spawned a new icon:`);
    socket.to(findRoomId(socket)).emit('iconSpawn', icon)
  });
  // icon move
  socket.on('iconMove', (movement) => {
    console.log(`User: ${socket.id} moved an icon`);
    socket.to(findRoomId(socket)).emit('iconMove', movement);
  });
  // icon edit
  socket.on('iconEdit', (editedIcon) => {
    console.log(`User: ${socket.id} edited an icon`);
    // socket.broadcast.emit('iconEdit', editedIcon);
    socket.to(findRoomId(socket)).emit('iconEdit', editedIcon);
  });

  // create new room server side and joins it
  socket.on('createRoom', () => {
    const newRoom = roomIdGenerator();
    roomList.add(newRoom);
    socket.join(newRoom);
    socket.emit('joinedRoom', newRoom);
  });
  // join room
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(socket.rooms);
    socket.emit('joinedRoom', roomId);
  })
  
  // new arenaState added
  socket.on('newArena', (newArenaState) => {
    console.log(`User: ${socket.id} added a new arena`);
    socket.to(findRoomId(socket)).emit('newArena', newArenaState);
  });

  // delete arenaState
  socket.on('deleteArena', (arenaIndex) => {
    console.log(`User: ${socket.id} deleted an arena`);
    socket.to(findRoomId(socket)).emit('deleteArena', arenaIndex);
  })

  socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
});

// serve the dev build, change to production builds when ready
app.use(express.static('../client/build'));

// list of rooms, room should be added only when a socket joins/creates the room
// current doesn't update when a socket leaves a room and the room disappears
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

// send react app
app.get('/', (req, res) => {
  res.sendFile('/index.html');
});
// not sure why root option is required but now the path is set 
// to client/build folder to get the index.html again
app.get('/:room', (req, res) => {
  var options = {
    root: path.join(__dirname,'../client/build')
  }
  // if the room provided in URL exists, then web app is sent
  if (roomList.has(req.params.room)){
    res.sendFile('/index.html', options);
  } else {
    // invalid room given, error is sent, 
    // TODO: create an error page to server instead
    res.send('No such room');
  }
});

const port = 8000
server.listen(port, () => {
  console.log(`Server is listening to port: ${port}`);
});