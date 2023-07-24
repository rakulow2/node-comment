const mongoose = require('mongoose');

// comment 스키마 정의
const Comment = new mongoose.Schema({
  post: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    trim: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
})


module.exports = mongoose.model("Comment", Comment);