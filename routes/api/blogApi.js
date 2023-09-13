var express = require('express');
var mdJWT= require('../../middlewares/api.auth');

var multer = require('multer')
var uploader = multer({dest:'./tmp'});
var BlogApiCtrl = require('../../controller/api/blog.api');
var router = express.Router();

router.get('/list/all',mdJWT.api_auth, BlogApiCtrl.listAllBlog);

router.get('/list/user/:idUser',mdJWT.api_auth, BlogApiCtrl.listBlogFromIdUser);

router.get('/detail/:idBlog',mdJWT.api_auth, BlogApiCtrl.detailBlog);

router.post('/insert',mdJWT.api_auth,uploader.any(),BlogApiCtrl.addBlog);

router.put('/update/:idBlog',mdJWT.api_auth, BlogApiCtrl.editBlog);

router.delete('/delete/:idBlog',mdJWT.api_auth,BlogApiCtrl.deleteBlog);

module.exports = router;