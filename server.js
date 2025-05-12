const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Сервер працює');
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Підключено до MongoDB');
  app.listen(3000, () => console.log('🚀 Сервер запущено на порту 3000'));
})
.catch((err) => console.error('❌ Помилка підключення до MongoDB:', err));
