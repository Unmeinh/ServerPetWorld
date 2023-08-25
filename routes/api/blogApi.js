var express = require('express');
// const fileUpload = require('express-fileupload');
// const app = express();
// app.use(fileUpload());
// app.use(express.urlencoded({ extended: true }));
var multer = require('multer')
var uploader = multer({dest:'./tmp'});
var BlogApiCtrl = require('../../controller/api/blog.api');
var router = express.Router();

router.get('/list/all', BlogApiCtrl.listAllBlog);

router.get('/list/user/:idUser', BlogApiCtrl.listBlogFromIdUser);

router.get('/detail/:idBlog', BlogApiCtrl.detailBlog);

router.post('/insert',uploader.any(), BlogApiCtrl.addBlog);

router.put('/update/:idBlog', BlogApiCtrl.editBlog);

router.delete('/delete/:idBlog',BlogApiCtrl.deleteBlog);

module.exports = router;