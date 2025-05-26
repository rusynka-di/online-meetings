const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/Message');

const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meetings');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST']
  }
});

io.on('connection', async (socket) => {
  console.log('🟢 Користувач підключився');

  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    socket.emit('messageHistory', messages.map(m => m.text));
  } catch (err) {
    console.error('❌ Помилка при отриманні історії повідомлень:', err);
  }

  socket.on('sendMessage', async (msg) => {
    try {
      const message = new Message({ text: msg });
      await message.save();
      io.emit('receiveMessage', msg);
    } catch (err) {
      console.error('❌ Помилка при збереженні повідомлення:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Користувач відключився');
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
