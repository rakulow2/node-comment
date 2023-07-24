// mongoose 모듈
const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/crudDB');
    console.log('몽고DB 연결 완료')
  } catch {
    console.log('몽고DB 연결 실패')
  }
})();