let mdBlog = require('../../model/blog.model');
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
            newBlog.imageBlogs = req.body.imageBlogs;
            newBlog.aspectRatio = req.body.aspectRatio;
            newBlog.idUser = req.body.idUser;
            newBlog.createdAt = new Date();

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
            newBlog.imageBlogs = req.body.imageBlogs;
            newBlog.aspectRatio = req.body.aspectRatio;
            newBlog.idUser = req.body.idUser;
            newBlog.createdAt = new Date();
            newBlog._id = idBlog;

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