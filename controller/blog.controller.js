let mdBlog = require('../model/blog.model');
let mdUserAcc = require('../model/userAccount.model');
let moment = require('moment');
let fs = require('fs');
let hashFunction = require('../function/hashFunction')

exports.listAllBlog = async (req, res, next) => {
    let msg = '';
    let filterSearch = null;
    let sortOption = null;
    let perPage = 10;
    let currentPage = parseInt(req.query.page) || 1;

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { contentBlog: new RegExp(searchTerm, 'i') };
            }
            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { contentBlog: req.query.sortOption };
            }

            let totalCount = await mdBlog.BlogModel.countDocuments(filterSearch);
            const totalPage = Math.ceil(totalCount / perPage);

            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPage) currentPage = totalPage;
            let skipCount = (currentPage - 1) * perPage;

            let listAllBlog = await mdBlog.BlogModel.find(filterSearch).populate('idUser').sort(sortOption).skip(skipCount).limit(perPage);
            msg = 'Lấy danh sách tất cả blog thành công';
            // console.log(listAllBlog);
            return res.render('Blog/listBlog', { listAllBlog: listAllBlog, countAllBlog: totalCount, countNowBlog: listAllBlog.length, msg: msg, moment: moment, currentPage: currentPage, totalPage: totalPage });
        } catch (error) {
            msg = 'Lỗi: ' + error.message;
            console.log(msg);
        }
    }
}
// exports.listBlogFromIdUser = async (req, res, next) => {
//     let idUser = req.params.idUser;

//     let listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).populate('idUser');
//     res.render('');
// }
exports.detailBlog = async (req, res, next) => {
    let idBlog = req.params.idBlog;
    let objB = await mdBlog.BlogModel.findById(idBlog).populate('idUser');
    let idAccount = objB.idUser.idAccount
    let objUserAcc = await mdUserAcc.UserAccountModel.findById(idAccount);
    console.log("objAxx "+objUserAcc);
    res.render('Blog/detailBlog', { objB: objB,objUserAcc:objUserAcc, moment: moment });
}

// exports.addBlog = async (req, res, next) => {
//     let msg='';
//     if (req.method == 'POST') {
//         let newBlog = new mdBlog.BlogModel();
//         newBlog.contentBlog = req.body.contentBlog;
//         newBlog.contentFont = req.body.contentFont;

//         fs.renameSync(req.file.path,'./public/upload/'+req.file.originalname);
//         newBlog.imageBlogs = 'http://localhost:3000/upload/'+req.file.originalname;
//         // console.log(req.file);
//         newBlog.aspectRatio = req.body.aspectRatio;
//         newBlog.idUser='64d4e1c79c5e5fb63b6211d3';
//         // newBlog.idUser=req.body.idUser;
//         newBlog.comments=0;
//         newBlog.shares=0;
//         newBlog.createdAt = new Date();

//         try {

//             await newBlog.save();
//             msg='Thêm bài viết thành công';
//             return res.redirect('/blog');
//         } catch (error) {
//             console.log(error.message);

//             if (error.message.match(new RegExp('.+`contentBlog` is require+.'))) {
//                 msg = 'Bạn chưa nhập nội dung!';
//             }
//             else {
//                 msg = "Đăng bài viết thất bại " + error.message;
//             }

//         }
//     }
//     res.render('Blog/addBlog',{msg:msg});
// }

exports.deleteBlog = async (req, res, next) => {
    let msg = '';
    let idBlog = req.params.idBlog;
    let objB = await mdBlog.BlogModel.findById(idBlog).populate('idUser');
    // console.log("objB: "+ objB);
    if (req.method == 'POST') {
        try {
            await mdBlog.BlogModel.findByIdAndDelete(idBlog);
            msg = 'Xóa bài viết thành công';
            return res.redirect('/blog');
        } catch (error) {
            msg = 'Xóa bài viết thất bại ';
            console.log(msg + error.message);
        }
    }
    res.render('Blog/deleteBlog', { objB: objB, msg: msg });
}

exports.shareBlog = async (req, res, next) => {
    console.log(req.params);
    if (req.params.idBlog) {
        let idBlog = hashFunction.decodeFromAscii(req.params.idBlog);
        let blog = await mdBlog.BlogModel.findById(idBlog);
        let image = (blog.imageBlogs.length > 0) ? blog.imageBlogs[0] : "https://res.cloudinary.com/dcf7f43rh/image/upload/v1695556234/images/logo/s2vq9g9kmy10wxvmeekc.jpg";
        let urlWithoutType = image.substring(0, image.lastIndexOf('.'));
        urlWithoutType = urlWithoutType.substring(0, urlWithoutType.lastIndexOf('blog'))
            + "blogHDScale" + urlWithoutType.substring(urlWithoutType.lastIndexOf('/'));
        // let urlWithoutImage = image.substring(0, image.lastIndexOf('/'));
        let imageUrl = urlWithoutType + "_HDScale.png";
        return res.render('Blog/shareBlog', { blog: blog, contentBlog: blog.contentBlog, imageBlog: imageUrl });
    }
    res.render('Blog/shareBlog');
}