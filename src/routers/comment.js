const express = require('express');
const router = new express.Router();
const commentsControllers = require('../controllers/comments-controllers');

router.get('/api/comments/:post', commentsControllers.getComments);

router.get('/api/comment/:id', commentsControllers.getComment);

router.post('/api/comment/create', commentsControllers.createComment);

router.put('/api/comment/:id', commentsControllers.updateComment);

router.delete('/api/comment/:id', commentsControllers.deleteComment);

module.exports = router;
