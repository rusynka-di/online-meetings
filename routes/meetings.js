const express = require('express');
const Meeting = require('../models/Meeting');
const authMiddleware = require('../middleware/authMiddleware');
const getZoomAccessToken = require('../utils/zoomToken');
const axios = require('axios');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { title, description, date } = req.body;

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

module.exports = router;
