let mdConvertS = require('../../model/Conversations.model');
let mdUser = require('../../model/user.model').UserModel;

exports.convertS = async (req, res, next) => {
  const { _id } = req.user;
  const { idUser, messageText } = req.body;
  try {

    let listConVertS = await mdConvertS.ConversationsModel.findOne({ idUser: _id }).populate('messages.idUser');
    if (req.method == "POST") {
      if (!listConVertS) {
        let newConvertS = new mdConvertS.ConversationsModel();
        newConvertS.createdAt = new Date()
        listConVertS = await newConvertS.save();
      }
      const itemmessages = {
        idUser,
        messageText,
      };

      const conVertsBefore = [...listConVertS.messages, itemmessages];
      listConVertS.messages = conVertsBefore;
      try {
        await mdConvertS.ConversationsModel.findByIdAndUpdate(
          { _id: listConVertS._id },
          listConVertS
        );
        console.log("addsdsdsdsdsd" + listConVertS);
        return res.status(200).json({
          success: true,
          data: listConVertS,
          message: "Thêm thành công",
        });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    }
    else if (req.method === "GET") {
      if (listConVertS) {
        return res.status(200).json({
          success: true,
          data: listConVertS,
          message: "Lấy danh sách giỏ hàng của người dùng thành công",
        });
      } else {
        return res.status(200).json({
          success: false,
          data: [], // Return an empty array for GET request when there's no data
          message: "Không có dữ liệu giỏ hàng",
        });
      }
    }
    }
  catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};