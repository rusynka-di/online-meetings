const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  date: {
    type: Date,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  zoomLink: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true // ➕ Додає createdAt і updatedAt автоматично
});

module.exports = mongoose.model('Meeting', MeetingSchema);
