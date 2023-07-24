const express = require('express');
const router = express.Router();
const Comment = require('../models/comment-shema');
const Post = require('../models/post-shema')
const mongoose = require('mongoose');

// 미들웨어
const authMiddleware = require('../middlewares/auth-middleware');


// POST : 댓글 등록하기
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const { nickname } = res.locals.user;

  const postDataCheck = await Post.findById(postId);
  if (!postDataCheck) {
    return res.status(404).json({ "message": "해당하는 게시물이 없습니다." });
  }

  // 유효성 검사 : body, params
  if (!comment) {
    throw new Error("데이터 형식이 올바르지 않습니다.")
  }

  // 댓글 생성
  const newComment = new Comment({ post: postId, comment, nickname });

  // 댓글 저장
  await newComment.save();

  res.status(200).json({ "message": "댓글이 작성되었습니다.", "comment": newComment });
});

// GET : 게시물에 맞는 댓글 데이터 가져오기
router.get('/posts/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  const postDataCheck = await Post.findById(postId);
  if (!postDataCheck) {
    return res.status(404).json({ "message": "해당하는 게시물이 없습니다." });
  }

  const resultDatas = await Comment.find({ post: postId }, '_id user content createdAt').sort({ createdAt: -1 }); // 뒤의 '_id .. ' 는 mongoDB 문법으로 특정 필드만 반환하도록 지정함

  // 유효성 검사 : body, params
  if (!postId) {
    throw new Error("데이터 형식이 올바르지 않습니다.")
  }

  res.status(200).json({ "message": "데이터 전송완료", "comments": resultDatas })
});

// PATCH : 댓글 수정하기
router.patch('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;

  const commentData = await Comment.findById(commentId);
  // 유효성 검사 : 댓글 데이터 확인
  if (!commentData) {
    return res.status(404).json({ "message": "해당하는 댓글이 없습니다." });
  }

  // 유효성 검사 : 댓글 작성 여부
  if (!comment) {
    throw new Error("댓글 내용을 입력해주세요.");
  }

  // 유효성 검사 : body, params
  if (!commentId || !comment) {
    throw new Error("데이터 형식이 올바르지 않습니다.");
  }

  commentData.comment = comment;
  await commentData.save();

  res.status(200).json({ "message": "댓글 수정 완료", "comment": commentData });
});

// DELETE : 댓글 삭제
router.delete('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const deleteData = req.body;

  const commentData = await Comment.findById(commentId);

  // 유효성 검사 : 댓글 데이터 확인
  if (!commentData) {
    return res.status(404).json({ "message": "해당하는 댓글이 없습니다." });
  }

  // 유효성 검사 : body, params
  if (!commentId) {
    throw new Error("데이터 형식이 올바르지 않습니다.");
  }

  await commentData.deleteOne();
  res.status(200).json({ "message": "댓글 삭제 완료" });

});




module.exports = router;