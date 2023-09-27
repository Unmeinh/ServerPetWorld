let mdFollow = require('../../model/follows.model').FollowsModel;
let mdUser = require('../../model/user.model').UserModel;

exports.myFollowing = async (req, res, next) => {
    try {
        let listFollow = await mdUser.find({ _id: req.user._id }).populate('followings.idFollow');
        if (listFollow) {
            return res.status(200).json({ success: true, data: listFollow[0].followings, type: "following", message: "Lấy danh sách đang theo dõi thành công." });
        } else {
            return res.status(500).json({ success: false, data: [], message: "Không có người đang theo dõi!" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

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
        let { idFollow } = req.body;
        if (idFollow) {
            if (String(idFollow) == String(req.user._id)) {
                return res.status(201).json({ success: false, data: {}, message: "Bạn không thể theo dõi chính mình!" });
            }
            let listUser = await mdUser.find({ _id: idFollow });
            if (listUser) {
                let isFlwing = req.user.followings.find((follow) => String(follow.idFollow) == String(idFollow));
                if (isFlwing) {
                    req.user.followings.splice(req.user.followings.indexOf(isFlwing), 1);
                    await mdUser.findByIdAndUpdate(req.user._id, req.user);
                } else {
                    req.user.followings.push({ idFollow: idFollow });
                    await mdUser.findByIdAndUpdate(req.user._id, req.user);
                }

                let userFollow = listUser[0];
                let isFlwer = userFollow.followers.find((follow) => String(follow.idFollow) == String(req.user._id));
                if (isFlwer) {
                    userFollow.followers.splice(userFollow.followers.indexOf(isFlwer), 1);
                    await mdUser.findByIdAndUpdate(userFollow._id, userFollow);
                } else {
                    userFollow.followers.push({ idFollow: req.user._id });
                    await mdUser.findByIdAndUpdate(userFollow._id, userFollow);
                }

                return res.status(201).json({ success: true, data: [req.user, userFollow], message: "Lấy danh sách người theo dõi thành công." });
            } else {
                return res.status(500).json({ success: false, data: {}, message: "Lỗi truy vấn cơ sở dữ liệu!" });
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
