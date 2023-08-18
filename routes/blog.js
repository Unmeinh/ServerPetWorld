var express = require('express');
var BlogCtrl = require('../controller/blog.controller');
var checkLogin = require('../middlewares/checkLogin');
var multer = require('multer');
var uploader = multer({dest:'./tmp'});

var router = express.Router();

router.get('/',checkLogin.check_request_login, BlogCtrl.listAllBlog);

// router.get('/user/:idUser', BlogCtrl.listBlogFromIdUser);

router.get('/detail/:idBlog',checkLogin.check_request_login, BlogCtrl.detailBlog);

// router.get('/add',checkLogin.check_request_login, BlogCtrl.addBlog);
// router.post('/add',uploader.single('imageBlogs'), BlogCtrl.addBlog);

// router.put('/edit/:idBlog', BlogCtrl.editBlog);
router.get('/delete/:idBlog',checkLogin.check_request_login,BlogCtrl.deleteBlog);
router.post('/delete/:idBlog',BlogCtrl.deleteBlog);

module.exports = router;