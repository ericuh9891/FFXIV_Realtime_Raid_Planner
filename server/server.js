const express = require("express");
const app = express();
const http = require("http");

const server = http.createServer(app);

// socket.io setup
const { Server } = require("socket.io");
const io = new Server(server);

// socket.io event handlers
io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('iconMoved', (data) => {
    console.log(`${Date.now()}: ${data.x}, ${data.y}`);
  });
})


app.use(express.static("../scrimba/build"));
app.get('/', (req, res) =>  {
  res.sendFile('/index.html');
});

server.listen(3001, () => {
  console.log("Server is Running");
});