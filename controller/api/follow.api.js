let mdFollow = require('../../model/follow.model');

exports.myFollower  = async(req,res,next)=>{
    try {
        
        let listFollow = await mdFollow.FollowModel.find().populate('idUser');
        if (listFollow) {
            return res.status(200).json({ success: true, data: listFollow, message: "Lấy danh sách người theo dõi tôi thành công" });
        }
        else {
            return res.status(203).json({ success: false, data:[], message: "Không có người nào theo dõi tôi" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
