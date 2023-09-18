const express = require('express');
const router = express.Router();
const socialController = require('../controller/socialController');

router.post('/create', socialController.createPost);
router.get('/posts', socialController.getPosts);
router.post('/comments/:postId', socialController.addComment);
router.get('/comments/:postId', socialController.getComments);

module.exports = router;