let mdFollow = require('../../model/follows.model').FollowsModel;

exports.myFollowing = async (req, res, next) => {
    try {
        let listFollow = await mdFollow.find({ idUser: req.user._id }).populate('arr_following.idFollowing');
        if (listFollow) {
            return res.status(200).json({ success: true, data: listFollow[0].arr_following, type: "following", message: "Lấy danh sách đang theo dõi thành công." });
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
        let listFollow = await mdFollow.find({ idUser: req.user._id }).populate('arr_follower.idFollower');
        if (listFollow) {
            return res.status(200).json({ success: true, data: listFollow[0].arr_follower, type: "follower", message: "Lấy danh sách người theo dõi thành công." });
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
            listFollow = await mdFollow.find({ idUser: req.params.idUser }).populate('arr_following.idFollowing');
        } else {
            return res.status(500).json({ success: false, data: [], message: "Lấy dữ liệu thất bại!" });
        }
        if (listFollow) {
            let listWithCheck = await getListFollowWithCheck(listFollow[0].arr_following, req.user._id, "following")
            if (listWithCheck) {
                return res.status(200).json({ success: true, data: listWithCheck, type: "follower", message: "Lấy danh sách người theo dõi thành công." });
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
            listFollow = await mdFollow.find({ idUser: req.params.idUser }).populate('arr_follower.idFollower');
        } else {
            return res.status(500).json({ success: false, data: [], message: "Lấy dữ liệu thất bại!" });
        }
        if (listFollow) {
            let listWithCheck = await getListFollowWithCheck(listFollow[0].arr_follower, req.user._id, "follower")
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
        if (req.body.idFollow) {
            let listFollowing = await mdFollow.find({ idUser: req.user._id });
            let listFollower = await mdFollow.find({ idUser: req.body.idFollow });
            if (listFollowing && listFollower) {
                if (listFollowing.length == 0) {
                    let newFler = new mdFollow();
                    newFler.idUser = req.user._id;
                    newFler.arr_following = [{ idFollowing: req.body.idFollow }];
                    await newFler.save();
                } else {
                    let fl = listFollowing[0];
                    let isFl = fl.arr_following.find((element) => String(element.idFollowing) == String(req.body.idFollow));
                    if (isFl) {
                        fl.arr_following.splice(fl.arr_following.indexOf(isFl), 1);
                        await mdFollow.findByIdAndUpdate(fl._id, fl);
                    } else {
                        fl.arr_following.push({ idFollowing: req.body.idFollow });
                        await mdFollow.findByIdAndUpdate(fl._id, fl);
                    }
                }
                if (listFollower.length == 0) {
                    let newFling = new mdFollow();
                    newFling.idUser = req.body.idFollow;
                    newFling.arr_follower = [{ idFollower: req.user._id }];
                    await newFling.save();
                } else {
                    let fl = listFollower[0];
                    let isFl = fl.arr_follower.find((element) => String(element.idFollower) == String(req.user._id));
                    if (isFl) {
                        fl.arr_follower.splice(fl.arr_follower.indexOf(isFl), 1);
                        await mdFollow.findByIdAndUpdate(fl._id, fl);
                    } else {
                        fl.arr_follower.push({ idFollower: req.user._id });
                        await mdFollow.findByIdAndUpdate(fl._id, fl);
                    }
                }
                return res.status(200).json({ success: true, data: [listFollowing, listFollower], message: "Lấy danh sách người theo dõi thành công." });
            } else {
                return res.status(500).json({ success: false, data: [], message: "Lỗi truy vấn cơ sở dữ liệu!" });
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
        const follow = follows[i];
        let check, idFollow;
        if (caseFl == "follower") {
            idFollow = follow.idFollower;
            check = await checkIsFollowedUser(idFollow, myId)
        } else {
            idFollow = follow.idFollowing;
            check = await checkIsFollowedUser(idFollow, myId)
        }

        if (check != undefined && idFollow != undefined) {
            if (caseFl == "follower") {
                followsWithCheck.push({
                    idFollower: idFollow,
                    isFollowed: check
                })
            } else {
                followsWithCheck.push({
                    idFollowing: idFollow,
                    isFollowed: check
                })
            }
        }
    }
    // console.timeEnd("test_timer");
    if (followsWithCheck.length == follows.length) {
        return followsWithCheck;
    }
    // let timeTaken = Date.now() - start;
    // console.log("Total time check taken : " + timeTaken + " milliseconds");
}

async function checkIsFollowedUser(idFollow, myId) {
    if (idFollow == myId) {
        return false; // Người theo dõi là mình
    }
    //Lấy danh sách theo dõi của từng người
    let listFollow = await mdFollow.find({ idUser: idFollow });
    if (listFollow) {
        let userFollow = listFollow[0];
        //Kiểm tra xem có trùng id vs mình không
        let isFollow = userFollow.arr_follower.find(follower => String(follower.idFollower) == String(myId));
        if (isFollow) {
            return true;
        } else {
            return false;
        }
    }
}
