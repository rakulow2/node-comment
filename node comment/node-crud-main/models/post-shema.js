const mongoose = require('mongoose');
const moment = require('moment');
const hooks = require('./hooks');


const Post = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: () => moment().format('YYYY-MM-DD HH:mm:ss'),
  },
});

Post.pre('save', hooks.hashPasswordHook);

module.exports = mongoose.model("Post", Post);
