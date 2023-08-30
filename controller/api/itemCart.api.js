let mdItemCart = require('../../model/itemCart.model');
exports.listItemCart  = async(req,res,next)=>{
    try {
        let listItemCart = await mdItemCart.ItemCartModel.find().populate('idProduct').populate('idUser');//
        if (listItemCart) {
            return res.status(200).json({ success: true, data: listItemCart, message: "Lấy danh sách giỏ hàng thành công" });
        }
        else {
            return res.status(203).json({ success: false, data:[], message: "Không có dữ liệu giỏ hàng" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
exports.listItemCartFromIdUser  = async(req,res,next)=>{
    let idUser = req.params.idUser;
    try {
        let listItemCartUser = await mdItemCart.ItemCartModel.find({ idUser: idUser }).populate('idProduct').populate('idUser');
        if (listItemCartUser) {
            return res.status(200).json({ success: true, data: listItemCartUser, message: "Lấy danh sách giỏ hàng của người dùng thành công" });
        }
        else {
            return res.status(203).json({ success: false, data: [], message: "Không có dữ liệu giỏ hàng" });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
   
}
exports.detailItemCart  = async(req,res,next)=>{
    let idItemCart = req.params.idItemCart;
    try {
        let objItemCart = await mdItemCart.ItemCartModel.findById(idItemCart).populate('idProduct').populate('idUser');
        return res.status(200).json({ success: true, data: objItemCart, message: "Lấy chi tiết giỏ hàng thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
}
exports.addItemCart  = async(req,res,next)=>{
    if (req.method == 'POST') {

        try {
            let newIC = new mdItemCart.ItemCartModel();
            newIC.idProduct = req.body.idProduct;
            newIC.idUser = req.body.idUser;
            newIC.amount = req.body.amount;
            newIC.createdAt = new Date();

            await newIC.save();
            return res.status(201).json({ success: true, data: newIC, message: "Thêm vào giỏ hàng thành công" });
        } catch (error) {
            console.log(error.message);
            let message = '';
            if (error.message.match(new RegExp('.+`amount` is require+.'))) {
                message = 'Bạn chưa nhập số lượng!';
            }
            else {
                message = error.message;
            }
            return res.status(500).json({ success: false, data: {}, message: message });
        }
    }
}
exports.editItemCart  = async(req,res,next)=>{
    let idItemCart = req.params.idItemCart;
    if (req.method == 'PUT') {
        try {
            let newIC = new mdItemCart.ItemCartModel();
            newIC.idProduct = req.body.idProduct;
            newIC.idUser = req.body.idUser;
            newIC.amount = req.body.amount;
            newIC.createdAt = new Date();
            newIC._id = idItemCart;

            await mdItemCart.ItemCartModel.findByIdAndUpdate(idItemCart, newIC);
            return res.status(200).json({ success: true, data: newIC, message: "Cập nhật giỏ hàng thành công" });
        } catch (error) {
            console.log(error.message);
            let message = '';
            if (error.message.match(new RegExp('.+`amount` is require+.'))) {
                message = 'Bạn chưa nhập số lượng!';
            }
            else {
                message = error.message;
            }
            return res.status(500).json({ success: false, data: {}, message: message });

        }
    }
}
exports.deleteItemCart  = async(req,res,next)=>{
    let idItemCart = req.params.idItemCart;
    if (req.method == 'DELETE') {
        try {
            await mdItemCart.ItemCartModel.findByIdAndDelete(idItemCart);
            return res.status(203).json({ success: true, data: {}, message: "Sản phẩm không còn trong giỏ hàng" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
        }
    }
}