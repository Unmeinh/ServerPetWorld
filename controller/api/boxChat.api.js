let mdBoxChat = require('../../model/boxChat.model');
let mdUser = require('../../model/user.model').UserModel;

exports.boxChat = async (req, res, next) => {
    const { _id } = req.user;
    const { idSender,contents } = req.body;
    try {
      let listBoxChat = await mdBoxChat.boxChatModel.findOne({ idUser: _id }).populate('idUser').populate("messages.idSender");
      if (req.method == "POST") {
        if (!listBoxChat) {
          let newBoxChat = new mdBoxChat.boxChatModel();
          newBoxChat.idUser = _id;
          listBoxChat = await newBoxChat.save();
        }
        const messages = {
          idSender,
          contents,
          createdAt: new Date(),
        };

        const boxChatBefore = [...listBoxChat.messages, messages];
        listBoxChat.messages = boxChatBefore;
        try {
          await mdBoxChat.boxChatModel.findByIdAndUpdate(
            { _id: listBoxChat._id},
            listBoxChat
          );
          return res.status(200).json({
            success: true,
            data: listBoxChat,
            message: "Thêm thành công",
          });
        } catch (error) {
          return res.status(500).json({ success: false, message: error.message });
        }
      }
      if (listBoxChat) {
        return res.status(200).json({
          success: true,
          data: listBoxChat,
          message: "Lấy danh sách thành công",
        });
      } else {
        return res.status(203).json({
          success: false,
          data: [],
          message: "Không có dữ liệu ",
        });
      } 
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };