let mdBlog = require('../../model/blog.model');
let mdUser = require('../../model/user.model');
let fs = require('fs');
let { decodeFromAscii } = require("../../function/hashFunction");
const { onUploadImages } = require('../../function/uploadImage');

exports.listAllBlog = async (req, res, next) => {
    let list = await mdBlog.BlogModel.find();
    let page = (req.query?.page != undefined && Number(req.query?.page) == 0) ? 1 : Number(req.query.page);
    let limit = 5;
    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let totalCount = await mdBlog.BlogModel.countDocuments();
    let totalPage = Math.ceil(totalCount / limit);
    let listAllBlog = [];
    let listTop10Blog = [];
    let listNotTop10BlogEndRemain = [];
    let listBlogFollowings = [];
    let listBlogLikeNotFollowings = [];
    let listBlogLikeAndFollowings = [];
    let listAllBlogRequested = [];

    // if (endIndex < list.length) {
    //     page = page + 1;
    // }

    // if (startIndex > 0) {
    //     page = page - 1;
    // }

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

            // await mdBlog.BlogModel.aggregate([
            //     {
            //         $match: {
            //             startDate: {
            //                 $gte: {
            //                     "$date": "2023-10-05T11:03:45.821Z"
            //                 }
            //             },
            //             endDate: {
            //                 $lte: {
            //                     "$date": "2023-10-01T11:03:45.821Z"
            //                 }
            //             }
            //         }
            //     }
            // ])

        } else {
            if (isNaN(page)) {
                return res.status(500).json({ success: false, message: "Số trang phải là số nguyên!" });
            }
            if (page <= 0) {
                return res.status(500).json({ success: false, message: "Số trang phải lớn hơn 0!" });
            }
            if (req.query?.loadBefore) {
                listAllBlog = await mdBlog.BlogModel.find().populate('idUser').sort({ createdAt: -1 }).limit(page * limit).skip(0).exec();
            } else {
                listAllBlog = await mdBlog.BlogModel.find().populate('idUser').sort({ createdAt: -1 }).limit(limit).skip(startIndex).exec();
            }
        }
        /** check chung 2 trường hợp có QUERY*/
        if (listAllBlog) {
            /**HIỂN THỊ BLOG <-> FOLLOW*/

            // let myUser = await mdUser.UserModel.find({ _id: req.user._id }).populate('followings.idFollow');
            /**1. Blog của người mình đã follow: lấy 1 blog*/
            // if (myUser.length > 0) {
            //     var objMyUser = myUser[0];
            //     if (objMyUser.followings.length > 0) {
            //         // console.log("Số following của bạn: " + objMyUser.followings.length)
            //         var listFollowing = objMyUser.followers;
            //         for (let i = 0; i < listFollowing.length; i++) {
            //             var listOneBlogFollingNow = await mdBlog.BlogModel.find({ idUser: String(listFollowing[i].idFollow) }).populate("idUser").sort({ createdAt: -1 });
            //             if (listOneBlogFollingNow.length > 0) {
            //                 listOneBlogFollingNow = listOneBlogFollingNow.slice(0, 1);
            //                 listBlogFollowings = listBlogFollowings.concat(listOneBlogFollingNow)
            //             }
            //         }
            //     }
            // }

            /** 2. Bài người mình follow và chưa like */
            // for (let i = 0; i < listAllBlog.length; i++) {
            //     if (listAllBlog[i].interacts.includes(req.user._id) > 0) {
            //         var listUser = await mdUser.UserModel.find({ _id: listAllBlog[i].idUser }).populate("idAccount").sort({ createdAt: -1 });
            //         if (listUser.length > 0) {
            //             var objUser = listUser[0];
            //             objUser.followers.map((item, index, arr) => {
            //                 if (item.idFollow != req.user._id) {
            //                     listBlogLikeNotFollowings.push(listAllBlog[i])
            //                 }
            //             })
            //         }

            //     }
            // }

            /** 3. Bài người mình follow đã từng like */
            // for (let j = 0; j < listAllBlog.length; j++) {
            //     if (listAllBlog[j].interacts.includes(req.user._id) > 0) {
            //         if (listUser.length > 0) {
            //             var objUser = listUser[0];
            //             objUser.followers.map((item, index, arr) => {

            //                 if (item.idFollow == req.user._id) {
            //                     listBlogLikeAndFollowings.push(listAllBlog[j]);
            //                 }
            //             })
            //         }
            //     }
            // }

            //  console.log("3: người mình đã từng like và đã follow: " + listBlogLikeAndFollowings.length);

            /** 4.0 check bài viết chưa like để thêm vào listTop10Blog*/
            // listAllBlog.map((item, index, arr) => {
            //     if (item.interacts.includes(req.user._id)) {
            //         listAllBlog = listAllBlog.filter(x => { return x != item })
            //     }
            // })
            // console.log("4.0: data mà mình chưa có like: " + listAllBlog);
            /** 4.1: lấy 10 bài viết có lượt tương tác cao nhất mà chưa like*/
            // listTop10Blog = listAllBlog.sort((a, b) => b.interacts.length - a.interacts.length).slice(0, 10);
            /**5:lấy tất cả các bài viết còn lại theo thời gian gần đây*/
            // var ids = new Set(listTop10Blog.map(({ id }) => id));
            // listNotTop10BlogEndRemain = listAllBlog.filter(({ id }) => !ids.has(id));

            /**6: [LIKE ĐÃ Ở 2,3] */
            /**Log check result */
            // console.log("1." + listBlogFollowings);
            // console.log("2: người mình đã từng like mà chưa follow: " + listBlogLikeButFollowings);
            // console.log("3: người mình đã từng like và đã follow: " + listBlogLikeButFollowings);
            // console.log("4.1: top 10 blog not have like: " + listAllBlog);

            /** ====LIST BLOG CHECKED REQUESTED====== */
            // listAllBlogRequested = [...listBlogFollowings, ...listBlogLikeNotFollowings, ...listBlogLikeAndFollowings, ...listTop10Blog, ...listNotTop10BlogEndRemain];

            let blogs = getListWithFollow(listAllBlog, req.user._id);
            return res.status(200).json({
                success: true, data: {
                    list: blogs,
                    isPage: req.query.page,
                    canLoadMore: (page != undefined && Number(page) < Number(totalPage)) ? true : false
                }, message: "Lấy danh sách bài viết thành công"
            });
        } else {
            return res.status(200).json({ success: false, message: "Không có bài viết nào!" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.listBlogFromIdUser = async (req, res, next) => {
    let idUser = req.params.idUser;
    let listBlogUser = [];
    let page = (req.query?.page != undefined && Number(req.query?.page) == 0) ? 1 : Number(req.query.page);
    let limit = 2;
    let startIndex = (page - 1) * limit;
    let totalCount = await mdBlog.BlogModel.find({idUser: idUser}).countDocuments();
    let totalPage = Math.ceil(totalCount / limit);

    try {
        /**Validate */
        if (!req.query.hasOwnProperty('page') || req.query.page == 'undefined' || req.query.page == '') {
            listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).sort({ createdAt: -1 }).populate('idUser');
        } else {
            if (isNaN(page)) {
                return res.status(500).json({ success: false, message: "Số trang phải là số nguyên!" });
            }
            if (page <= 0) {
                return res.status(500).json({ success: false, message: "Số trang phải lớn hơn 0!" });
            }
            if (req.query?.loadBefore) {
                listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).populate('idUser').sort({ createdAt: -1 }).limit(page * limit).skip(0).exec();
            } else {
                listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).populate('idUser').sort({ createdAt: -1 }).limit(limit).skip(startIndex).exec();
            }
        }

        if (listBlogUser) {
            let blogs = getListWithFollow(listBlogUser, req.user._id);
            return res.status(200).json({ success: true, data: {
                list: blogs,
                isPage: req.query.page,
                canLoadMore: (page != undefined && Number(page) < Number(totalPage)) ? true : false
            }, message: "Lấy danh sách bài viết thành công" });
        } else {
            return res.status(500).json({ success: false, message: "Không có bài viết nào!" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: 'Lỗi: ' + error.message });
    }
}

exports.listMyBlog = async (req, res, next) => {
    let idUser = req.user._id;
    let listBlogUser = [];
    let page = (req.query?.page != undefined && Number(req.query?.page) == 0) ? 1 : Number(req.query.page);
    let limit = 2;
    let startIndex = (page - 1) * limit;
    let totalCount = await mdBlog.BlogModel.find({idUser: idUser}).countDocuments();
    let totalPage = Math.ceil(totalCount / limit);

    try {
        /**Validate */
        if (!req.query.hasOwnProperty('page') || req.query.page == 'undefined' || req.query.page == '') {
            listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).sort({ createdAt: -1 }).populate('idUser');
        } else {
            if (isNaN(page)) {
                return res.status(500).json({ success: false, message: "Số trang phải là số nguyên!" });
            }
            if (page <= 0) {
                return res.status(500).json({ success: false, message: "Số trang phải lớn hơn 0!" });
            }
            if (req.query?.loadBefore) {
                listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).populate('idUser').sort({ createdAt: -1 }).limit(page * limit).skip(0).exec();
            } else {
                listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).populate('idUser').sort({ createdAt: -1 }).limit(limit).skip(startIndex).exec();
            }
        }

        if (listBlogUser) {
            // let blogs = getListWithFollow(listBlogUser, req.user._id);
            return res.status(200).json({ success: true, data: {
                list: listBlogUser,
                isPage: req.query.page,
                canLoadMore: (page != undefined && Number(page) < Number(totalPage)) ? true : false
            }, message: "Lấy danh sách bài viết thành công" });
        } else {
            return res.status(500).json({ success: false, message: "Không có bài viết nào!" });
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
            let images = await onUploadImages(req.files, 'blog')
            if (images != [] && images[0] == false) {
                if (images[1].message.indexOf('File size too large.') > -1) {
                    return res.status(500).json({ success: false, data: {}, message: "Dung lượng một ảnh tối đa là 10MB!" });
                } else {
                    return res.status(500).json({ success: false, data: {}, message: images[1].message });
                }
            }
            newBlog.imageBlogs = [...images];
            newBlog.aspectRatio = req.body.aspectRatio;
            newBlog.idUser = req.user._id;
            newBlog.createdAt = new Date();
            newBlog.comments = 0;
            newBlog.shares = 0;
            newBlog.interacts = [];

            await newBlog.save();
            if (!newBlog) {
                return res.status(201).json({ success: true, data: {}, message: "Đăng bài viết thất bại!" });
            }
            req.user = req.user.toObject();
            req.user.blogs = Number(req.user.blogs) + 1;
            await mdUser.UserModel.findByIdAndUpdate(req.user._id, req.user);
            let blog = await getBlogWithFollow(newBlog, req.user._id)
            return res.status(201).json({ success: true, data: blog, message: "Đăng bài viết thành công." });
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
            let oldBlog = await mdBlog.BlogModel.findById(idBlog);
            oldBlog.contentBlog = req.body.contentBlog;
            oldBlog.contentFont = req.body.contentFont;
            oldBlog.aspectRatio = req.body.aspectRatio;
            let images = await onUploadImages(req.files, 'blog');
            if (images != [] && images[0] == false) {
                if (images[1].message.indexOf('File size too large.') > -1) {
                    return res.status(500).json({ success: false, data: {}, message: "Dung lượng một ảnh tối đa là 10MB!" });
                } else {
                    return res.status(500).json({ success: false, data: {}, message: images[1].message });
                }
            }
            if (JSON.parse(req.body.oldImages) != []) {
                oldBlog.imageBlogs = [...JSON.parse(req.body.oldImages), ...images];
            } else {
                oldBlog.imageBlogs = [...images];
            }

            await mdBlog.BlogModel.findByIdAndUpdate(idBlog, oldBlog);
            let blog = await getBlogWithFollow(oldBlog, req.user._id);
            return res.status(201).json({ success: true, data: blog, message: "Đã sửa bài viết" });
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
            req.user = req.user.toObject();
            req.user.blogs = Number(req.user.blogs) - 1;
            await mdUser.UserModel.findByIdAndUpdate(req.user._id, req.user);
            return res.status(203).json({ success: true, data: {}, message: "Xóa blog thành công." });
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

async function getBlogWithFollow(blog, loginId) {
    let blogWithFollow = {};
    let blogPopulate = await blog.populate(['idUser', {
        path: 'idUser',
        populate: {
            path: 'idAccount',
            select: 'online'
        },
    }]);
    let user = blogPopulate.idUser;
    let isFL = user.followers.find(follower => String(follower.idFollow) == String(loginId));
    if (isFL) {
        blogWithFollow = {
            ...blogPopulate.toObject(),
            isFollowed: true
        };
    } else {
        blogWithFollow = {
            ...blogPopulate.toObject(),
            isFollowed: false
        };
    }
    return blogWithFollow;
}