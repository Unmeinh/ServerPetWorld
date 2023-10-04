let mdBlog = require('../../model/blog.model');
let mdUser = require('../../model/user.model');
let fs = require('fs');
let { decodeFromAscii } = require("../../function/hashFunction");
const { onUploadImages } = require('../../function/uploadImage');

exports.listAllBlog = async (req, res, next) => {
    let list = await mdBlog.BlogModel.find();
    let page = req.query.page;
    let limit = 10;
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let totalCount = await mdBlog.BlogModel.countDocuments();
    let totalPage = Math.ceil(totalCount / limit);
    let listAllBlog = [];
    let listTop10Blog = [];
    let listNotTop10Blog = [];
    let listBlogFollowings = [];
    let listAllBlogRequested = [];
    let listBlogLikeButFollowings = [];

    if (endIndex < list.length) {
        page = page + 1;
    }

    if (startIndex > 0) {
        page = page - 1;
    }

    try {
        /**Validate */
        if (!req.query.hasOwnProperty('page') || req.query.page == 'undefined' || req.query.page == '') {
            console.log("[Blog] Haven't query");
            listAllBlog = await mdBlog.BlogModel.find().populate(['idUser', {
                path: 'idUser',
                populate: {
                    path: 'idAccount',
                    select: 'online'
                },
            }]).sort({ createdAt: -1 });
            // listAllBlog = await mdBlog.BlogModel.find().populate('idUser').sort({ createdAt: -1 });
        } else {
            if (page <= 0) {
                return res.status(500).json({ success: false, message: "Số trang phải lớn hơn 0" });
            }
            if (isNaN(page)) {
                return res.status(500).json({ success: false, message: "Số trang Page phải là số nguyên!" });
            }

            listAllBlog = await mdBlog.BlogModel.find().populate('idUser').sort({ createdAt: -1 }).limit(limit).skip(startIndex).exec();
        }
        /** check chung 2 trường hợp có QUERY*/
        if (listAllBlog) {
            /**check bài viết đã like hay chưa để thêm vào listTop10Blog*/
            // listAllBlog.map((item, index, arr) => {
            //     if (item.interacts.includes(req.user._id)) {
            //         listAllBlog = listAllBlog.filter(x => { return x != item })
            //     }
            // })
            // /**lấy 10 bài viết có lượt tương tác cao nhất*/
            // listTop10Blog = listAllBlog.sort((a, b) => b.interacts.length - a.interacts.length).slice(0, 10);
            // /**lấy tất cả các bài viết còn lại theo thời gian gần đây*/
            // var ids = new Set(listTop10Blog.map(({ id }) => id));
            // listNotTop10Blog = listAllBlog.filter(({ id }) => !ids.has(id));
            // /**Setup ngày hiển thị các bài viết chỉ 7 ngày */

            // /**HIỂN THỊ BLOG <-> FOLLOW*/
            // let myUser = await mdUser.UserModel.find({ _id: req.user._id }).populate('followings.idFollow');
            // if (myUser.length > 0) {
            //     var objMyUser = myUser[0];

            //     /** Blog của người mình đã follow: lấy 1 blog*/
            //     if (objMyUser.followings.length > 0) {
            //         // console.log("Số following của bạn: " + objMyUser.followings.length)
            //         var listFollowing = objMyUser.followers;
            //         for (let i = 0; i < listFollowing.length; i++) {
            //             var listOneBlogFollingNow = await mdBlog.BlogModel.find({ idUser: String(listFollowing[i].idFollow) }).sort({ createdAt: -1 });
            //             if (listOneBlogFollingNow.length > 0) {
            //                 listOneBlogFollingNow = listOneBlogFollingNow.slice(0, 1);
            //                 listBlogFollowings = listBlogFollowings.concat(listOneBlogFollingNow)
            //             }
            //         }
            //     }

            //     /** Bài viết của người mình đã từng like mà chưa follow*/
            //     // var listFollowing = objMyUser.followers;
            //     // for (let i = 0; i < listFollowing.length; i++) {
            //     //     var listOneBlogFollingNow = await mdBlog.BlogModel.find({ idUser: String(listFollowing[i].idFollow) }).sort({ createdAt: -1 });
            //     //     if (listOneBlogFollingNow.length > 0) {
            //     //         listOneBlogFollingNow = listOneBlogFollingNow.slice(0, 1); 
            //     //         listBlogFollowings = listBlogFollowings.concat(listOneBlogFollingNow)
            //     //     }
            //     // }
            // }
            // console.log(listBlogFollowings);

            // listAllBlogRequested = [...listTop10Blog, ...listBlogFollowings, ...listNotTop10Blog];

            let blogs = getListWithFollow(listAllBlog, req.user._id);
            return res.status(200).json({ success: true, data: listAllBlogRequested, message: "Lấy danh sách bài viết thành công" });
        }
        else {
            return res.status(500).json({ success: false, message: "Không có bài viết nào!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.listBlogFromIdUser = async (req, res, next) => {
    let list = await mdBlog.BlogModel.find();
    let page = req.query.page;
    let limit = 10;
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let totalCount = await mdBlog.BlogModel.countDocuments();
    let totalPage = Math.ceil(totalCount / limit);

    if (endIndex < list.length) {
        page = page + 1;
    }

    if (startIndex > 0) {
        page = page - 1;
    }

    let idUser = req.params.idUser;
    let listBlogUser = [];

    try {
        /**Validate */
        if (!req.query.hasOwnProperty('page') || req.query.page == 'undefined' || req.query.page == '') {
            listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).sort({ createdAt: -1 }).populate('idUser');
        } else {
            if (isNaN(page)) {
                return res.status(500).json({ success: false, message: "Số trang Page phải là số nguyên!" });
            }

            listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).sort({ createdAt: -1 }).populate('idUser').limit(limit).skip(startIndex).exec();
        }

        if (listBlogUser) {
            return res.status(200).json({ success: true, data: listBlogUser, message: "Lấy danh sách bài viết thành công" });
        }
        else {
            return res.status(500).json({ success: false, message: "Không có bài viết nào!" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
    }
}

exports.listMyBlog = async (req, res, next) => {
    let list = await mdBlog.BlogModel.find();
    let page = req.query.page;
    let limit = 10;
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let totalCount = await mdBlog.BlogModel.countDocuments();
    let totalPage = Math.ceil(totalCount / limit);

    if (endIndex < list.length) {
        page = page + 1;
    }

    if (startIndex > 0) {
        page = page - 1;
    }

    let idMyUser = req.user._id;
    let listMyBlog = []
    console.log("idMyUser: " + idMyUser);
    try {
        /**Validate */
        if (!req.query.hasOwnProperty('page') || req.query.page == 'undefined' || req.query.page == '') {
            listMyBlog = await mdBlog.BlogModel.find({ idUser: idMyUser }).sort({ createdAt: -1 }).populate('idUser')
        } else {
            if (isNaN(page)) {
                return res.status(500).json({ success: false, message: "Số trang Page phải là số nguyên!" });
            }
            listMyBlog = await mdBlog.BlogModel.find({ idUser: idMyUser }).sort({ createdAt: -1 }).populate('idUser').limit(limit).skip(startIndex).exec();
        }

        if (listMyBlog) {
            return res.status(200).json({ success: true, data: listMyBlog, message: "Lấy danh sách bài viết của bạn thành công" });
        }
        else {
            return res.status(500).json({ success: false, data: [], message: "Không có bài viết nào!" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
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
            newBlog.imageBlogs = await onUploadImages(req.files, 'blog')
            newBlog.aspectRatio = req.body.aspectRatio;
            newBlog.idUser = req.body.idUser;
            newBlog.createdAt = new Date();
            newBlog.comments = 0;
            newBlog.shares = 0;
            newBlog.interacts = [];

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

            newBlog.imageBlogs = req.body.imageBlogs;
            // newBlog.aspectRatio = req.body.aspectRatio;
            newBlog.idUser = req.user._id;
            newBlog.createdAt = new Date();
            // newBlog.comments = 0;
            // newBlog.shares = 0;

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

exports.interactPost = async (req, res, next) => {
    if (req.method == 'POST') {
        let idBlog = req.params.idBlog;
        try {
            if (idBlog) {
                let objBlog = await mdBlog.BlogModel.findById({ _id: idBlog }).populate(['idUser', {
                    path: 'idUser',
                    populate: {
                        path: 'idAccount',
                        select: 'online'
                    },
                }]);
                if (objBlog) {
                    let arr_Interact = objBlog.interacts
                    if (arr_Interact.includes(req.user._id)) {
                        arr_Interact.splice(arr_Interact.indexOf(req.user._id), 1)
                    } else {
                        arr_Interact.push(req.user._id)
                    }
                    await mdBlog.BlogModel.findByIdAndUpdate(idBlog, objBlog);
                }

                return res.status(201).json({ success: true, data: objBlog, message: "Đã tương tác với bài viết" });
            } else {
                return res.status(500).json({ success: false, message: "Không đọc được dữ liệu tải lên!" });
            }
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });

        }
    }
}

function getListWithFollow(blogs, loginId) {
    let blogsWithFollow = [];
    blogs.map((blog) => {
        let user = blog.idUser;
        let isFL = user.followers.find(follower => String(follower.idFollow) == String(loginId));
        if (isFL) {
            blogsWithFollow.push(
                {
                    ...blog.toObject(),
                    isFollowed: true
                }
            );
        } else {
            blogsWithFollow.push(
                {
                    ...blog.toObject(),
                    isFollowed: false
                }
            );
        }
    })
    return blogsWithFollow;
}
