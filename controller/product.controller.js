let mdProduct = require('../model/product.model');

exports.listProduct = async (req, res, next) => {
    let msg = '';
    if (req.method == 'GET') {
        try {
            let listProduct = await mdProduct.ProductModel.find();
            msg = 'Lấy danh sách sản phẩm thành công';
            let countAllProduct = await mdProduct.ProductModel.count();
            return res.render('Product/listProduct', { listProduct: listProduct,countAllProduct:countAllProduct, msg: msg });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách  sản phẩm: ' + msg);
        }

    }

}
exports.detailProduct = async (req, res, next) => {
    
    res.render('Product/detailProduct');
}

exports.addProduct = async (req, res, next) => {
    try {
        if (req.method === 'POST') {
            const { tensanpham, avatar_Product } = req.body; // Lấy thông tin từ form
            
            const newProduct = new mdProduct.ProductModel({
                nameProduct: tensanpham,
                arr_Product: avatar_Product
            });

            await newProduct.save();
            
            const msg = 'Sản phẩm đã được thêm thành công';
            return res.render('Product/addProduct', { msg: msg });
        } else {
            return res.render('Product/addProduct');
        }
    } catch (error) {
        const msg = 'Lỗi khi thêm sản phẩm: ' + error.message;
        console.error(msg);
        return res.render('Product/addProduct', { msg: msg });
    }
}
exports.editProduct = async (req, res, next) => {
    res.render('Product/editProduct');
}
exports.deleteProduct = async (req, res, next) => {
    res.render('Product/deleteProduct');
}