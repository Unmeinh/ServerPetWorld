let mdComment = require('../../model/comment.model');

exports.listCommentFromIdBlog = async (req, res, next) => {
    let idBlog = req.params.idBlog;
    try {
        let listCommentByBlog = await mdComment.CommentModel.find({ idBlog: idBlog }).populate('idBlog').populate('idUser');
        if (listCommentByBlog.length > 0) {
            return res.status(200).json({ success: true, data: listCommentByBlog, message: "Lấy danh bình luận theo bài viết thành công" });
        }
        else {
            return res.status(203).json({ success: false, data: [], message: "Không có dữ liệu bình luận" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
    }
}

exports.addComment = async (req, res, next) => {
    console.log('req... ' + req.method);
    if (req.method == 'POST') {
        console.log('==========');
        try {
            let newComment = new mdComment.CommentModel();
            newComment.idBlog = req.body.idBlog;
            newComment.idUser = req.body.idUser;
            newComment.content = req.body.content;
            newComment.createdAt = new Date()
            newComment.interacts = req.body.interacts;

            await newComment.save()
            return res.status(201).json({ success: true, data: newComment, message: "Đã đăng bình luận mới" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: error.message });
        }
    }
}

exports.interactsBlog = async (req, res, next) => {

}

exports.editComment = async (req, res, next) => {
    console.log('req... ' + req.method);
    if (req.method == 'PUT') {
        let idComment = req.params.idComment;
        console.log('==========');
        try {
            let newComment = new mdComment.CommentModel();
            newComment.idBlog = req.body.idBlog;
            newComment.idUser = req.body.idUser;
            newComment.content = req.body.content;
            newComment.createdAt = new Date()
            newComment.interacts = req.body.interacts;
            newComment._id = idComment;

            await mdComment.CommentModel.findByIdAndUpdate(idComment, newComment).populate('idBlog').populate('idUser');

            return res.status(200).json({ success: true, data: newComment, message: "Đã cập nhật bình luận mới" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: error.message });
        }
    }
}
exports.deleteComment = async (req, res, next) => {
    console.log('req... ' + req.method);
    if (req.method == 'DELETE') {
        let idComment = req.params.idComment;
        console.log('==========');
        try {

            await mdComment.CommentModel.findByIdAndDelete(idComment);

            return res.status(200).json({ success: true, data: {}, message: "Đã xóa bình luận" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: error.message });
        }
    }
}