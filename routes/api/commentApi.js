var express = require('express');
var mdJWT= require('../../middlewares/api.auth');

var CommentApiCtrl = require('../../controller/api/comment.api');
var router = express.Router();

router.get('/list/blog/:idBlog', CommentApiCtrl.listCommentFromIdBlog);

router.post('/insert', CommentApiCtrl.addComment);

router.put('/update/:idComment', CommentApiCtrl.editComment);

router.delete('/delete/:idComment', CommentApiCtrl.deleteComment);

module.exports = router;