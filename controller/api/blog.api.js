let mdBlog = require('../../model/blog.model');
let fs = require('fs');
exports.listAllBlog = async (req, res, next) => {

    try {
        let listAllBlog = await mdBlog.BlogModel.find().populate('idUser');
        if (listAllBlog) {
            return res.status(200).json({ success: true, data: listAllBlog, message: "Lấy danh sách tất cả blog thành công" });
        }
        else {
            return res.status(203).json({ success: false, message: "Không có dữ liệu blog" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
exports.listBlogFromIdUser = async (req, res, next) => {
    let idUser = req.params.idUser;
    try {
        let listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).populate('idUser');
        if (listBlogUser) {
            return res.status(200).json({ success: true, data: listBlogUser, message: "Lấy danh sách blog thành công" });
        }
        else {
            return res.status(203).json({ success: false, data: [], message: "Không có dữ liệu blog" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
exports.detailBlog = async (req, res, next) => {
    let idBlog = req.params.idBlog;
    try {
        let objBlog = await mdBlog.BlogModel.findById(idBlog);
        return res.status(200).json({ success: true, data: objBlog, message: "Lấy dữ liệu blog thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}

exports.addBlog = async (req, res, next) => {
    if (req.method == 'POST') {

        try {
            let newBlog = new mdBlog.BlogModel();
            newBlog.contentBlog = req.body.contentBlog;
            newBlog.contentFont = req.body.contentFont;

            if (req.files != undefined) {
                console.log("check "+req.files);
                req.files.map((file, index, arr) => {
                    console.log("check2 "+file);
                  if (file != {}) {
                    fs.renameSync(file.path, './public/upload/' + file.originalname);
                    let imagePath = 'http://localhost:3000/upload/' + file.originalname;
                    newBlog.imageBlogs.push(imagePath);
                  }
                })
              }
           
            // if (req.files && req.files.length > 0) {
            //      newBlog.imageBlogs = req.files.map(file => "http://localhost:3000/upload/"  + file.originalname); // Lưu đường link + tên tệp vào mảng
            // } else {
            //     newBlog.imageBlogs = []; // Mảng rỗng nếu không có ảnh được tải lên
            // }
            // newBlog.imageBlogs = req.body.imageBlogs;
            newBlog.aspectRatio = req.body.aspectRatio;
            newBlog.idUser = req.body.idUser;
            newBlog.createdAt = new Date();
            newBlog.comments=0;
            newBlog.shares=0;

            await newBlog.save();
            return res.status(201).json({ success: true, data: newBlog, message: "Đã đăng bài viết mới" });
        } catch (error) {
            console.log(error.message);
            let message = '';
            if (error.message.match(new RegExp('.+`contentBlog` is require+.'))) {
                message = 'Bạn chưa nhập nội dung!';
            }
            else {
                message = "Đăng bài viết thất bại " + error.message;
            }
            return res.status(500).json({ success: false, data: {}, message: message });

        }
    }
}
exports.editBlog = async (req, res, next) => {
   
    let idBlog = req.params.idBlog;
    if (req.method == 'PUT') {
        try {
           let newBlog = new mdBlog.BlogModel();
            newBlog.contentBlog = req.body.contentBlog;
            newBlog.contentFont = req.body.contentFont;

            if (req.files != undefined) {
                req.files.map((file, index, arr) => {
                  if (file != {}) {
                    fs.renameSync(file.path, '../../public/upload/' + file.originalname);
                    let imagePath = 'http://localhost:3000/upload/' + file.originalname;
                    newBlog.imageBlogs.push(imagePath);
                  }
                })
              }

            // if (req.files && req.files.length > 0) {
            //      newBlog.imageBlogs = req.files.map(file => "http://localhost:3000/upload/"  + file.originalname); // Lưu đường link + tên tệp vào mảng
            // } else {
            //     newBlog.imageBlogs = []; // Mảng rỗng nếu không có ảnh được tải lên
            // }
            newBlog.imageBlogs = req.body.imageBlogs;
            newBlog.aspectRatio = req.body.aspectRatio;
            newBlog.idUser = req.body.idUser;
            newBlog.createdAt = new Date();
            newBlog.comments=0;
            newBlog.shares=0;

            await mdBlog.BlogModel.findByIdAndUpdate(idBlog, newBlog);
            return res.status(200).json({ success: true, data: newBlog, message: "Đã sửa bài viết" });
        } catch (error) {
            console.log(error.message);
            let message = '';
            if (error.message.match(new RegExp('.+`contentBlog` is require+.'))) {
                message = 'Bạn chưa nhập nội dung!';
            }
            else {
                message = "Sửa bài viết thất bại";
                console.log(error.message);
            }
            return res.status(500).json({ success: false, data: {}, message: message });

        }
    }
}
exports.deleteBlog = async (req, res, next) => {
    let idBlog = req.params.idBlog;
    if (req.method == 'DELETE') {
        try {
            await mdBlog.BlogModel.findByIdAndDelete(idBlog);
            return res.status(203).json({ success: true, data: {}, message: "Tài khoản này không còn tồn tại" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
        }
    }
}