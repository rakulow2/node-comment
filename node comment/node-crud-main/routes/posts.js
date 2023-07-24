const express = require('express');
const router = express.Router();
const Post = require('../models/post-shema');
const mongoose = require('mongoose')

// 미들웨어
const authMiddleware = require('../middlewares/auth-middleware');


// POST: 게시물 등록하기
router.post('/posts', authMiddleware, async (req, res, next) => {
  const { title, content } = req.body;
  const { nickname } = res.locals.user;

  // 유효성 검사: body, params
  if (!title || !content) {
    throw new Error("데이터 형식이 올바르지 않습니다.");
  }

  try {
    const newPost = await Post.create({
      nickname,
      title,
      content
    });

    res.status(200).json({ "message": "게시글을 생성하였습니다.", "post": newPost });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      errorMessage: "게시글 작성에 실패하였습니다."
    });
  }
});


// GET : 게시물 데이터 가져오기
router.get('/posts', async (req, res) => {
  const { postId } = req.query;

  // query string (ex. localhost:3000/posts/?postId=648a73fc7f1b29c6a60222)
  if (postId) {
    const postData = await Post.findById(postId);
    if (!postData) {
      return res.status(404).json({ "message": "해당하는 게시물이 없습니다." });
    }

    return res.json({ "result": postData });
  }

  // 전체 posts 조회 (ex. localhost:3000/posts)
  const postDatas = await Post.find().sort({ createdAt: -1 });
  return res.json({ "result": postDatas });

});


// PATCH: 게시물 수정하기
router.patch('/posts/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  const postData = await Post.findById(postId);
  if (!postData) {
    return res.status(404).json({ "message": "해당하는 게시물이 없습니다." });
  }

  // 유효성 검사 : body
  if (!title && !content) {
    throw new Error("수정할 내용을 입력하세요.")
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });

  res.status(200).json({ "message": "게시글을 수정하였습니다.", "post": updatedPost });

});



// DELETE : 게시물 삭제하기
router.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params;

  const postData = await Post.findById(postId);
  if (!postData) {
    return res.status(404).json({ "message": "해당하는 게시물이 없습니다." });
  }

  // 유효성 검사 : body, params
  if (!postId) {
    throw new Error("데이터 형식이 올바르지 않습니다.")
  }

  await postData.deleteOne();

  res.status(200).json({ "message": "게시물을 삭제하였습니다." });

});


module.exports = router;
