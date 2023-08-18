var express = require('express');
var BlogApiCtrl = require('../../controller/api/blog.api');
var router = express.Router();

router.get('/', BlogApiCtrl.listAllBlog);

router.get('/user/:idUser', BlogApiCtrl.listBlogFromIdUser);

router.get('/detail/:idBlog', BlogApiCtrl.detailBlog);

router.post('/add', BlogApiCtrl.addBlog);

router.put('/edit/:idBlog', BlogApiCtrl.editBlog);

router.delete('/delete/:idBlog',BlogApiCtrl.deleteBlog);

module.exports = router;