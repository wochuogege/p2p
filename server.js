const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer();
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const users = {}; // 存储用户ID和socket的映射

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('register', (id) => {
    users[id] = socket.id;
    socket.emit('registered', id);
    console.log(`User registered with ID: ${id}`);
  });

  socket.on('offer', ({ offer, targetId }) => {
    const targetSocket = users[targetId];
    if (targetSocket) {
      io.to(targetSocket).emit('offer', { offer, from: socket.id });
    }
  });

  socket.on('answer', ({ answer, targetId }) => {
    const targetSocket = users[targetId];
    if (targetSocket) {
      io.to(targetSocket).emit('answer', answer);
    }
  });

  socket.on('candidate', ({ candidate, targetId }) => {
    const targetSocket = users[targetId];
    if (targetSocket) {
      io.to(targetSocket).emit('candidate', candidate);
    }
  });

  socket.on('disconnect', () => {
    for (let id in users) {
      if (users[id] === socket.id) {
        delete users[id];
        break;
      }
    }
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Signaling Server running on port ${port}`);
});