const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Meeting = require('../models/Meeting');
const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');


const router = express.Router();

router.post('/meetings', authMiddleware, async (req, res) => {
  const { title, date, description } = req.body;

  try {
    const meeting = new Meeting({
      title,
      description,
      date,
      creator: req.user.userId,
    });

    await meeting.save();

    const accessToken = await getZoomAccessToken();

    const zoomResponse = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: title,
        type: 2, 
        start_time: date,
        duration: 30,
        timezone: 'Europe/Kyiv',
        settings: {
          join_before_host: true,
          approval_type: 0,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(201).json({
      message: 'Зустріч створено успішно',
      meeting,
      zoom: zoomResponse.data,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Помилка при створенні Zoom-зустрічі' });
  }
});

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
  console.error('❌ Login error:', err); 
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
