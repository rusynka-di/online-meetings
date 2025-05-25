const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Користувач уже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Користувача успішно створено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Користувача не знайдено' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Невірний пароль' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Авторизація успішна' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, date } = req.body;

  try {
    const meeting = await Meeting.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.userId },
      { title, description, date },
      { new: true }
    );

    if (!meeting) {
      return res.status(404).json({ message: 'Зустріч не знайдено' });
    }

    res.json({ message: 'Зустріч оновлено', meeting });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при оновленні зустрічі' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const meeting = await Meeting.findOneAndDelete({
      _id: req.params.id,
      creator: req.user.userId,
    });

    if (!meeting) {
      return res.status(404).json({ message: 'Зустріч не знайдено' });
    }

    res.json({ message: 'Зустріч видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка при видаленні зустрічі' });
  }
});

module.exports = router;
