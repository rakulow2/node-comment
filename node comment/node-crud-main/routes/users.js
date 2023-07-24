const express = require('express');
const router = express.Router();
const User = require('../models/user-shema');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")


// API : 회원가입
router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;

  try {
    // 유효성 검사 : 닉네임,비밀번호 정규식 확인
    const nicknameRegex = /^[a-zA-Z0-9]{3,}$/;
    const passwordRegex = /^.{4,}$/;

    if (!nicknameRegex.test(nickname) || !passwordRegex.test(password)) {
      return res.status(412).json({
        "errorMessage": "닉네임과 비밀번호를 알맞게 입력해주세요."
      })
    }

    // 유효성 검사 : id값과 password 에 같은 값이 포함된 경우 
    if (nickname.includes(password)) {
      return res.status(412).json({
        "errorMessage": "패스워드에 닉네임이 포함되어 있습니다."
      })
    }

    // 유효성 검사 : confim과 password 비교
    if (password !== confirm) {
      return res.status(412).json({
        "errorMessage": "패스워드가 일치하지 않습니다"
      })
    }

    // 유효성 검사: 중복 닉네임 확인
    const userCheck = await User.findOne({ nickname });
    if (userCheck) {
      return res.status(412).json({
        "errorMessage": "중복된 닉네임입니다."
      });
    }

    // api 작동
    const user = new User({ nickname, password });
    await user.save();

    res.status(201).json({
      "message": "회원가입에 성공했습니다."
    })
  } catch (error) {
    console.error(error);
    res.status(400).json({
      "errorMessage": "요청한 데이터 형식이 올바르지 않습니다."
    })
  }
});

// API : 로그인
router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;

  try {

    // 유효성 검사 : 닉네임 중복/패스워드 일치여부 확인
    const user = await User.findOne({ nickname });

    if (!user || user.password !== password) {
      return res.status(400).json({
        "errorMessage": "닉네임 또는 패스워드를 확인해주세요"
      })
    }

    // jwt 생성
    const token = jwt.sign({ userId: user.nickname }, "customized-secret-key");
    res.cookie("Authorization", `Bearer ${token}`);

    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      "errorMessage": "로그인에 실패하였습니다."
    })
  }
});


module.exports = router;