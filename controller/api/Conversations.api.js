let mdConvertS = require('../../model/Conversations.model');
let mdUser = require('../../model/user.model').UserModel;

exports.convertS = async (req, res, next) => {
    const { _id } = req.user;
    const { idSender } = req.body;
    try {
      let listConVertS = await mdConvertS.ConversationsModel.findOne({ idUser: _id }).populate('arr_receivers.idSender');
      if (req.method == "POST") {
        if (!listConVertS) {
          let newConvertS = new mdConvertS.ConversationsModel();
          newConvertS.createdAt = new Date()
          newConvertS.idUser = _id;
          listConVertS = await newConvertS.save();
        }
        const conVertsBefore = [...listConVertS.arr_receivers, {idSender}];
        listConVertS.arr_receivers = conVertsBefore;
        try {
          await mdConvertS.ConversationsModel.findByIdAndUpdate(
            { _id: listConVertS._id},
            listConVertS
          );
          return res.status(200).json({
            success: true,
            data: listConVertS,
            message: "Thêm  thành công",
          });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message });
        }
      }
      if (listConVertS) {
        const arrReceiversData = listConVertS.arr_receivers.map(receiver => ({
          fullName: receiver.idSender.fullName,
          avatarUser: receiver.idSender.avatarUser
        }));
  
        return res.status(200).json({
          success: true,
          data: arrReceiversData,
          message: "Lấy danh sách giỏ hàng của người dùng thành công",
        });
      } else {
        return res.status(203).json({
          success: false,
          data: [],
          message: "Không có dữ liệu giỏ hàng",
        });
      } 
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };