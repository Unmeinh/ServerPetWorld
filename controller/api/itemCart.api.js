let mdItemCart = require('../../model/itemCart.model');
let mdCart = require('../../model/cart.model');

exports.addItemCart = async (req, res, next) => {
    if (req.method == 'POST') {
        if (req.body.amount <= 0) {
            return res.status(500).json({ success: false, data: {}, message: 'Vui lòng chọn số lượng!' });
        }
        try {
            let newIC = new mdItemCart.ItemCartModel();
            newIC.idProduct = req.body.idProduct;
            newIC.idCart = req.body.idCart;
            newIC.amount = req.body.amount;
            newIC.isSelect = req.body.isSelect;//true or fall when add Cart
            newIC.createdAt = new Date();

            await newIC.save();

            /** insert item cart to cart */
            var listCart = await mdCart.CartModel.find({ _id: newIC.idCart })
            if (listCart.length > 0) {
                var objCart = listCart[0];
                objCart.carts.push(newIC);
                await mdCart.CartModel.findByIdAndUpdate(objCart._id, objCart)
            }

            return res.status(201).json({ success: true, data: newIC, message: "Thêm vào giỏ hàng thành công" });
        } catch (error) {
            console.log(error.message);
            let message = '';
            if (error.message.match(new RegExp('.+`amount` is require+.'))) {
                message = 'Bạn chưa chọn số lượng!';
            }
            else {
                message = error.message;
            }
            return res.status(500).json({ success: false, data: {}, message: message });
        }
    }
}
exports.editItemCart = async (req, res, next) => {
    let idItemCart = req.params.idItemCart;
    if (req.method == 'PUT') {
        if (req.body.amount <= 0) {
            return res.status(500).json({ success: false, data: {}, message: 'Vui lòng chọn số lượng!' });
        }
        try {
            let newIC = new mdItemCart.ItemCartModel();
            newIC.idProduct = req.body.idProduct;
            newIC.idCart = req.body.idCart;
            newIC.amount = req.body.amount;
            newIC.isSelect = req.body.isSelect;
            newIC.createdAt = new Date();
            newIC._id = idItemCart;

            await mdItemCart.ItemCartModel.findByIdAndUpdate(idItemCart, newIC);

            /** update item cart to cart*/
            let listCart = await mdCart.CartModel.find({ _id: newIC.idCart })
            if (listCart.length > 0) {
                var objCart = listCart[0];
                var itemCart = listCart[0].carts;
                itemCart.map((item, index) => {

                    console.log(objCart);
                    if (String(item._id) === String(newIC._id)) {
                        // console.log("vô dc");
                        itemCart[index] = newIC

                    }
                })

                await mdCart.CartModel.findByIdAndUpdate(objCart._id, objCart)
            }
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
exports.deleteItemCart = async (req, res, next) => {
    let idItemCart = req.params.idItemCart;
    if (req.method == 'DELETE') {
        try {
            let newIC = new mdItemCart.ItemCartModel();
            newIC.idCart = req.body.idCart;
            newIC._id = idItemCart;
            console.log("NEWiC: " + newIC.idCart);
            console.log("----xóa nhé");

            /** delete item cart to cart*/
            let listCart = await mdCart.CartModel.find({ _id: newIC.idCart })
            console.log("list cart: " + listCart.length);
            if (listCart.length > 0) {
                var objCart = listCart[0];
                var itemCart = listCart[0].carts;
                itemCart.map((item, index) => {
                    console.log("item: " + item);
                    console.log("item.id: " + item._id);
                    console.log("newIC._id: " + newIC._id);
                    if (String(item._id) === String(newIC._id)) {
                        itemCart.splice(index, 1);

                    }
                })

                await mdCart.CartModel.findByIdAndUpdate(objCart._id, objCart)
            }
            await mdItemCart.ItemCartModel.findByIdAndDelete(idItemCart);
            return res.status(203).json({ success: true, data: {}, message: "Sản phẩm không còn trong giỏ hàng" });
        } catch (error) {
            return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
        }
    }
}