const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  deadline: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Todo', todoSchema);
