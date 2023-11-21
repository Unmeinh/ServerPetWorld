let mdComment = require('../../model/comment.model');
let mdBlog = require('../../model/blog.model').BlogModel;

exports.listCommentFromIdBlog = async (req, res, next) => {
    let idBlog = req.params.idBlog;
    try {
        let listCommentByBlog = await mdComment.CommentModel.find({ idBlog: idBlog }).populate('idUser').sort({ createdAt: -1 });
        if (listCommentByBlog.length > 0) {
            return res.status(200).json({ success: true, data: listCommentByBlog, message: "Lấy danh bình luận theo bài viết thành công" });
        } else {
            return res.status(200).json({ success: false, data: [], message: "Không có dữ liệu bình luận" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
    }
}

exports.addComment = async (req, res, next) => {
    let idUser = req.user._id;
    let { idBlog, content } = req.body;
    if (req.method == 'POST') {
        try {
            if (idBlog && content) {
                let newComment = new mdComment.CommentModel();
                newComment.idBlog = idBlog;
                newComment.idUser = idUser;
                newComment.content = content;
                newComment.interacts = [];
                newComment.createdAt = new Date();

                await newComment.save();
                let comment = await newComment.populate('idUser');
                let blog = await mdBlog.findById(idBlog);
                if (blog) {
                    blog.comments++;
                    await mdBlog.findByIdAndUpdate(idBlog, blog);
                }
                return res.status(201).json({ success: true, data: comment, message: "Đăng bình luận thành công." });
            } else {
                return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên!" });
            }
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: error.message });
        }
    }
}

exports.editComment = async (req, res, next) => {
    if (req.method == 'PUT') {
        let { idBlog, idComment, content } = req.body;
        try {
            if (idBlog && idComment && content) {
                let comment = await mdComment.CommentModel.findById(idComment);
                if (comment) {
                    comment.content = content;
                    comment.createdAt = new Date()
                    await mdComment.CommentModel.findByIdAndUpdate(idComment, comment);
                    return res.status(201).json({ success: true, data: comment, message: "Cập nhật bình luận thành công!" });
                }
            } else {
                return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên!" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, data: {}, message: error.message });
        }
    }
}
exports.deleteComment = async (req, res, next) => {
    if (req.method == 'DELETE') {
        let idComment = req.params.idComment;
        try {
            if (idComment) {
                let comment = await mdComment.CommentModel.findById(idComment);
                if (comment) {
                    await mdComment.CommentModel.findByIdAndDelete(idComment);
                    let blog = await mdBlog.findById(comment.idBlog);
                    if (blog) {
                        blog.comments--;
                        await mdBlog.findByIdAndUpdate(comment.idBlog, blog);
                    }
                    return res.status(203).json({ success: true, data: {}, message: "Đã xóa bình luận" });
                }
            } else {
                return res.status(500).json({ success: false, data: {}, message: "Không đọc được dữ liệu tải lên!" });
            }
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
    console.log("Listcomment: " + listCommentBlog);
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