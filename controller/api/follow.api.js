let mdFollow = require('../../model/follow.model');
/**Follower */
exports.myFollower = async (req, res, next) => {
    let idMyUser = req.user._id;
    try {
        let listMyFollower = await mdFollow.FollowModel.find({ idUser: idMyUser });
        if (listMyFollower.length > 0) {
            return res.status(200).json({ success: true, data: listMyFollower, message: "Lấy danh sách người theo dõi tôi thành công" });
        }
        else {
            return res.status(203).json({ success: false, data: [], message: "Không có người nào theo dõi tôi" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

/**Following */
exports.myFollowing = async (req, res, next) => {
    let idMyUser = req.user._id;
    try {
        let listMyFollowing = await mdFollow.FollowModel.find({ idUser: idMyUser });
        if (listMyFollowing.length > 0) {
            return res.status(200).json({ success: true, data: listMyFollowing, message: "Lấy danh sách người tôi theo dõi thành công" });
        }
        else {
            return res.status(203).json({ success: false, data: [], message: "Không có người nào tôi  theo dõi cả" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
/**Add Follow */
exports.addFollowing = async (req, res, next) => {
    let idMyUser = req.user._id;
    let idUser = req.params.idUser;
    if (req.method == 'POST') {
        try {
            let listFollowMe = await mdFollow.FollowModel.findOne({ idUser: idMyUser })
            
            if(!listFollowMe)
            {
                let newFollowing =  new mdFollow.FollowModel();
                newFollowing.idUser = idMyUser;
            
                await newFollowing.save();
            }
           
            return res.status(201).json({ success: true, data: newFollowing, message: "Đã follow user này" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Lỗi: " + error.message });

        }
    }
    
}
/**Delete Follow */
exports.deleteFollowing = async (req, res, next) => {
    let idMyUser = req.user._id;
    let idUser = req.params.idBlog;
    if (req.method == 'DELETE') {
        try {
            let findUser = await mdFollow.FollowModel.find({ idUser: idMyUser });
            if (findUser.length > 0) {
                var  myUser= findUser[0]
                var myFollowing = myUser.arr_following
                if (myFollowing.includes(idUser)) {
                    myFollowing.splice(myFollowing.indexOf(idUser), 1)

                }
                await mdFollow.FollowModel.findByIdAndUpdate({ _id: findUser._id }, myFollowing);
            }
            
            return res.status(200).json({ success: true, data: newFollowing, message: "Đã bỏ follow user này" });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Lỗi: " + error.message });

        }
    }
    
}
