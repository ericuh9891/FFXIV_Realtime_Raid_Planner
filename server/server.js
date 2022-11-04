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
  socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
});

app.use(express.static('../client/build'));

// send react app
app.get('/', (req, res) => {
  res.sendFile('/index.html');
});

const port = 8000
server.listen(port, () => {
  console.log(`Server is listening to port: ${port}`);
});