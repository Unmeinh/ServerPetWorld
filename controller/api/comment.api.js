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
    let idUser = req.user._id;
    if (req.method == 'POST') {
        try {
            let newComment = new mdComment.CommentModel();
            newComment.idBlog = req.body.idBlog;
            newComment.idUser = idUser;
            newComment.content = req.body.content;
            newComment.createdAt = new Date()

            await newComment.save()
            return res.status(201).json({ success: true, data: newComment, message: "Đã thêm bình luận mới" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: error.message });
        }
    }
}

exports.editComment = async (req, res, next) => {
    let idUser = req.user._id;
    if (req.method == 'PUT') {
        let idComment = req.params.idComment;
        
        try {
            let newComment = new mdComment.CommentModel();
            newComment.idBlog = req.body.idBlog;
            newComment.idUser = idUser;
            newComment.content = req.body.content;
            newComment.createdAt = new Date()
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
/**comment in comment */
exports.addCommentInComment = async (req, res, next) => {
    let idUser = req.user._id;
    let idBlog = req.params.idBlog;
    let listCommentBlog = await mdComment.CommentModel.find({ idBlog: idBlog }).populate('idUser').populate('idBlog');
    console.log("Listcomment: "+listCommentBlog);
    if (req.method == 'POST') {
        try {
            if (!listCommentBlog) {
                let newComment = new mdComment.CommentModel();
                newComment.idBlog = req.body.idBlog;
                newComment.idUser = idUser;
                newComment.content = req.body.content;
                newComment.createdAt = new Date()

                listCommentBlog = await newComment.save()
            }

            let conmentInComment = {
                idBlog: listCommentBlog._id,
                idUser: req.body.idUser,
                interact: req.body.interact
            }

            let commentBefore = [...listCommentBlog.interacts, conmentInComment]
            listCommentBlog.interacts = commentBefore

            await mdComment.CommentModel.findByIdAndUpdate({ _id: listCommentUser._id }, listCommentUser)

            return res.status(200).json({ success: true, data: listCommentUser, message: "Đã phản hồi bình luận" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: error.message });
        }
    }
}