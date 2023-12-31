var express = require('express');
var mdJWT= require('../../middlewares/api.auth');

var CommentApiCtrl = require('../../controller/api/comment.api');
var router = express.Router();

router.get('/list/:idBlog', CommentApiCtrl.listCommentFromIdBlog);

router.post('/insert',mdJWT.api_user_auth, CommentApiCtrl.addComment);

router.put('/update', CommentApiCtrl.editComment);

router.delete('/delete/:idComment', CommentApiCtrl.deleteComment);
//comment in comment
router.post('/insert/blog/comment/:idBlog',mdJWT.api_user_auth, CommentApiCtrl.addCommentInComment);

module.exports = router;