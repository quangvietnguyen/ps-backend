const express = require('express');
const router = new express.Router();
const commentsControllers = require('../controllers/comments-controllers');

router.get('/comments/:post', commentsControllers.getComments);

router.get('/comment/:id', commentsControllers.getComment);

router.post('/comment/create', commentsControllers.createComment);

router.put('/comment/:id', commentsControllers.updateComment);

router.delete('/comment/:id', commentsControllers.deleteComment);

module.exports = router;
