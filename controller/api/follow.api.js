let mdUser = require('../../model/user.model').UserModel;
const unidecode = require('unidecode');
const { sendFCMNotification } = require('../../function/notice');

exports.myFollowing = async (req, res, next) => {
    try {
        let listFollow = await mdUser.find({ _id: req.user._id }).populate('followings.idFollow');
        if (listFollow) {
            let listWithCheck = await getListFollowWithCheck(listFollow[0].followings, req.user._id, "following")
            if (listWithCheck) {
                return res.status(200).json({ success: true, data: listWithCheck, type: "following", message: "Lấy danh sách đang theo dõi thành công." });
            }
        } else {
            return res.status(500).json({ success: false, data: [], message: "Không có người đang theo dõi!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.searchMyFollowing = async (req, res, next) => {
    try {
        const { fullName } = req.query;
        const normalizedFullName = unidecode(fullName).toLowerCase();
        const user = await mdUser.findById(req.user._id).populate('followings.idFollow', 'fullName avatarUser');

        if (!user) {
            return res.status(500).json({ success: false, data: [], message: "User not found!" });
        }

        const matchingUsers = [];

        for (const following of user.followings) {
            const normalizedFollowingFullName = unidecode(following.idFollow.fullName).toLowerCase();
            if (normalizedFollowingFullName.includes(normalizedFullName)) {
                const { fullName, avatarUser } = following.idFollow;
                matchingUsers.push({ fullName, avatarUser });
            }
        }

        if (matchingUsers.length > 0) {
            return res.status(200).json({ success: true, data: matchingUsers, type: "following", message: "Matching users found." });
        } else {
            return res.status(200).json({ success: true, data: [], message: "No matching users found." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.myFollower = async (req, res, next) => {
    try {
        let listFollow = await mdUser.find({ _id: req.user._id }).populate('followers.idFollow');
        if (listFollow) {
            let listWithCheck = await getListFollowWithCheck(listFollow[0].followers, req.user._id, "follower")
            if (listWithCheck) {
                return res.status(200).json({ success: true, data: listWithCheck, type: "follower", message: "Lấy danh sách người theo dõi thành công." });
            }
        } else {
            return res.status(500).json({ success: false, data: [], message: "Không có người theo dõi!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.userFollowing = async (req, res, next) => {
    try {
        let listFollow = [];
        if (req.params.idUser) {
            listFollow = await mdUser.find({ _id: req.params.idUser }).populate('followings.idFollow');
        } else {
            return res.status(500).json({ success: false, data: [], message: "Lấy dữ liệu thất bại!" });
        }
        if (listFollow) {
            let listWithCheck = await getListFollowWithCheck(listFollow[0].followings, req.user._id, "following")
            if (listWithCheck) {
                return res.status(200).json({ success: true, data: listWithCheck, type: "following", message: "Lấy danh sách người theo dõi thành công." });
            }
        } else {
            return res.status(500).json({ success: false, data: [], message: "Không có người đang theo dõi!" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.userFollower = async (req, res, next) => {
    try {
        let listFollow = [];
        if (req.params.idUser) {
            listFollow = await mdUser.find({ _id: req.params.idUser }).populate('followers.idFollow');
        } else {
            return res.status(500).json({ success: false, data: [], message: "Lấy dữ liệu thất bại!" });
        }
        if (listFollow) {
            let listWithCheck = await getListFollowWithCheck(listFollow[0].followers, req.user._id, "follower")
            if (listWithCheck) {
                return res.status(200).json({ success: true, data: listWithCheck, type: "follower", message: "Lấy danh sách người theo dõi thành công." });
            }
        } else {
            return res.status(500).json({ success: false, data: [], message: "Không có người theo dõi!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

exports.insertFollow = async (req, res, next) => {
    try {
        let { idFollow, isFlw } = req.body;
        if (idFollow && isFlw != undefined) {
            if (String(idFollow) == String(req.user._id)) {
                return res.status(201).json({ success: false, data: {}, message: "Bạn không thể theo dõi chính mình!" });
            }
            let listUser = await mdUser.find({ _id: idFollow }).populate('idAccount');
            if (listUser) {
                let userFollow = listUser[0].toObject();
                req.user = req.user.toObject();
                let isFlwing = req.user.followings.find((follow) => String(follow.idFollow) == String(idFollow));
                if (isFlwing) {
                    if (String(isFlw) == "false") {
                        req.user.followings.splice(req.user.followings.indexOf(isFlwing), 1);
                        await mdUser.findByIdAndUpdate(req.user._id, req.user);
                        // await sendFCMNotification(
                        //     req.user?.tokenDevice,
                        //     `Bỏ theo dõi thành công!`,
                        //     `Bạn đã bỏ theo dõi ${userFollow.fullName}.`,
                        //     'CLIENT',
                        //     [],
                        //     req.user?._id,
                        //     1
                        // );
                    }
                } else {
                    if (String(isFlw) == "true") {
                        req.user.followings.push({ idFollow: idFollow });
                        await mdUser.findByIdAndUpdate(req.user._id, req.user);
                        await sendFCMNotification(
                            req.user?.tokenDevice,
                            `Theo dõi thành công!`,
                            `Bạn đã theo dõi ${userFollow.fullName}.`,
                            'CLIENT',
                            [],
                            req.user?._id,
                            1
                        );
                    }
                }

                let isFlwer = userFollow.followers.find((follow) => String(follow.idFollow) == String(req.user._id));
                if (isFlwer) {
                    if (String(isFlw) == "false") {
                        userFollow.followers.splice(userFollow.followers.indexOf(isFlwer), 1);
                        await mdUser.findByIdAndUpdate(userFollow._id, userFollow);
                        userFollow.isFollowed = false;
                    } else {
                        userFollow.isFollowed = true;
                    }
                } else {
                    if (String(isFlw) == "true") {
                        userFollow.followers.push({ idFollow: req.user._id });
                        await mdUser.findByIdAndUpdate(userFollow._id, userFollow);
                        await sendFCMNotification(
                            userFollow?.tokenDevice,
                            `${req.user.fullName} đã theo dõi bạn!`,
                            `Bạn đã được theo dõi bởi ${req.user.fullName}.`,
                            'CLIENT',
                            [],
                            userFollow?._id,
                            3
                        );
                        userFollow.isFollowed = true;
                    } else {
                        userFollow.isFollowed = false;
                    }
                }

                return res.status(201).json({ success: true, data: userFollow, message: "Theo dõi người dùng thành công." });
            } else {
                return res.status(201).json({ success: false, data: {}, message: "Lỗi truy vấn cơ sở dữ liệu!" });
            }
        } else {
            return res.status(500).json({ success: false, message: "Không đọc được dữ liệu tải lên!" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function getListFollowWithCheck(follows, myId, caseFl) {
    // let start = Date.now();
    // console.time("test_timer");
    let followsWithCheck = []; // Danh sách theo dõi của người khác
    for (let i = 0; i < follows.length; i++) {
        let follow = follows[i].idFollow;
        let check = await checkIsFollowedUser(follow, myId)

        if (check != undefined) {
            followsWithCheck.push({
                idFollow: follow,
                isFollowed: check
            })
        }
    }
    // console.timeEnd("test_timer");
    if (followsWithCheck.length == follows.length) {
        return followsWithCheck;
    }
    // let timeTaken = Date.now() - start;
    // console.log("Total time check taken : " + timeTaken + " milliseconds");
}

async function checkIsFollowedUser(follow, myId) {
    if (String(follow._id) == String(myId)) {
        return -1; // Người theo dõi là mình
    }
    if (follow.followers.length > 0) {
        //Kiểm tra xem có trùng id vs mình không
        let isFollow = follow.followers.find(follower => String(follower.idFollow) == String(myId));
        if (isFollow) {
            return 0;
        } else {
            return 1;
        }
    }
}
