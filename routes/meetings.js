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
      creator: req.user.userId
    });

    await meeting.save();
    res.status(201).json({ message: 'Зустріч створено успішно', meeting });
  } catch (err) {
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
