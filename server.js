const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const [username, setUsername] = useState('');

const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meetings');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🟢 Користувач підключився');

  socket.on('sendMessage', (msg) => {
    io.emit('receiveMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Користувач вийшов');
  });
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);

app.get('/', (req, res) => {
  res.send('Сервер працює');
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Підключено до MongoDB');
  server.listen(3000, () => console.log('🚀 Сервер запущено на порту 3000'));
})
.catch((err) => console.error('❌ Помилка підключення до MongoDB:', err));
