const mongoose = require("mongoose");

const User = new mongoose.Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
})

// 가상의 userId값 할당
User.virtual("userId").get(function () {
  return this.nickname;
});

// user 정보를 JSON으로 형변환 할떄 virtual 값이 출력되도록 설정
User.set("toJSON", {
  virtuals: true,
})

module.exports = mongoose.model("User", User)