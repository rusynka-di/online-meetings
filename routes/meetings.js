const express = require('express');
const Meeting = require('../models/Meeting');
const authMiddleware = require('../middleware/authMiddleware');

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

module.exports = router;
