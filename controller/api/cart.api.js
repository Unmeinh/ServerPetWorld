let mdCart = require('../../model/cart.model');
exports.listCart  = async(req,res,next)=>{
    try {
       
        let listCart = await mdCart.CartModel.find();
        if (listCart) {
            return res.status(200).json({ success: true, data: listCart, message: "Lấy danh sách giỏ hàng thành công" });
        }
        else {
            return res.status(203).json({ success: false, data:[], message: "Không có dữ liệu giỏ hàng" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
exports.listCartByIdUser  = async(req,res,next)=>{
    let idUser = req.params.idUser;
    try {
        let listCartUser = await mdCart.CartModel.find({ idUser: idUser });
        if (listCartUser) {
            return res.status(200).json({ success: true, data: listCartUser, message: "Lấy danh sách giỏ hàng của người dùng thành công" });
        }
        else {
            return res.status(203).json({ success: false, data: [], message: "Không có dữ liệu giỏ hàng" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
