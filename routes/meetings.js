const express = require('express');
const router = express.Router(); 
const authMiddleware = require('../middleware/authMiddleware');
const Meeting = require('../models/Meeting');
const getZoomAccessToken = require('../utils/zoomToken');
const axios = require('axios');

router.post('/', authMiddleware, async (req, res) => {
  const { title, description, date } = req.body;

  try {
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

    const meeting = new Meeting({
      title,
      description,
      date,
      creator: req.user.userId,
      zoomLink: zoomResponse.data.join_url, 
    });

    await meeting.save();

    res.status(201).json({
      message: 'Зустріч створено успішно',
      meeting,
      zoom: zoomResponse.data,
    });

  } catch (err) {
    console.error('Помилка Zoom:', err.response?.data || err.message); 
    res.status(500).json({ message: 'Помилка при створенні зустрічі' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const meetings = await Meeting.find({ creator: req.user.userId }).sort({ date: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: 'Помилка при отриманні зустрічей' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ message: 'Зустріч не знайдена' });
    res.json({ message: 'Зустріч видалено' });
  } catch (err) {
    console.error('Помилка при видаленні зустрічі:', err.message);
    res.status(500).json({ message: 'Не вдалося видалити зустріч' });
  }
});

module.exports = router; 
