const express = require('express');
require('express-async-errors');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;


//-- 미들웨어 설정 --//
app.use(express.json());
app.use(cookieParser());

//-- DB --//
require('./models/index');

//-- 라우트 설정 --//
const postsRouter = require('./routes/posts');
const commentRouter = require('./routes/comments');
const usersRouter = require('./routes/users');
app.use('/api', [postsRouter, commentRouter, usersRouter]);

//-- express-async-errors 400 에러처리 --//
// eexpress-async-errors 패키지 : 비동기 함수에서 발생하는 에러 처리 설정 가능
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send({ "message": "오류 발생", "error": err.message });
  next();
});

//-- 기본 경로 라우트 --//
app.get('/', (req, res) => {
  res.send('안녕하세요, Express 애플리케이션입니다!');
});


// 쿠키를 삭제하는 엔드포인트 또는 미들웨어를 작성합니다.
app.get('/clear-cookies', (req, res) => {
  // 쿠키를 제거하는 방법은 쿠키의 만료 시간을 이전으로 설정하는 것입니다.
  // 미래의 유효하지 않은 시간으로 설정하여 쿠키를 무효화합니다.
  res.cookie('Authorization', '', { expires: new Date(0) });
  res.cookie('authorization', '', { expires: new Date(0) });
  res.cookie('customized-secret-key', '', { expires: new Date(0) });

  // 응답을 반환합니다.
  res.send('쿠키가 삭제되었습니다.');
});


//-- 서버 시작 --//
app.listen(port, () => {
  console.log(`http://localhost:${port} 서버 생성`);
});
