let mdFavoriteProducts = require('../../model/myfavoriteproduct.model');
let mdProduct = require('../../model/product.model');

exports.listAllMyFavoriteProducts = async (req, res, next) => {
  const {_id}=req.user;

  try {
      let listAllMyFavorite = await mdFavoriteProducts.FavoriteModel.find({idUser: _id}).populate('idProduct');
      if (listAllMyFavorite) {
          return res.status(200).json({ success: true, data: listAllMyFavorite, message: "Lấy danh sách tất cả sản phẩm yêu thích thành công" });
      }
      else {
          return res.status(203).json({ success: false, message: "Không có dữ liệu blog" });
      }

  } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
  }
}

exports.addFavoriteProducts = async (req, res, next) => {
  const { _id } = req.user;
  const { idProduct } = req.body;
  
  // Kiểm tra xem idProduct có tồn tại và không chỉ chứa khoảng trắng
  if (!idProduct || /\s/.test(idProduct)) {
    return res.status(400).json({
      success: false,
      message: 'idProduct không hợp lệ',
    });
  }

  try {
    let listFavorite = await mdFavoriteProducts.FavoriteModel.findOne({ idUser: _id });
    
    if (!listFavorite) {
      let newFavorite = new mdFavoriteProducts.FavoriteModel();
      newFavorite.idUser = _id;
      listFavorite = await newFavorite.save();
    }
    const productExists = await mdProduct.ProductModel.exists({ _id: idProduct });
    
    if (!productExists) {
      return res.status(400).json({
        success: false,
        message: 'Sản phẩm không tồn tại',
      });
    }

    if (!listFavorite.idProduct.includes(idProduct)) {
      listFavorite.idProduct.push(idProduct); 
      try {
        await mdFavoriteProducts.FavoriteModel.findByIdAndUpdate(
          { _id: listFavorite._id },
          listFavorite
        );
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    } else {
      return res.status(200).json({
        success: true,
        data: listFavorite, 
        message: "Sản phẩm bị trùng",
      });
    }

    if (listFavorite) {
      return res.status(200).json({
        success: true,
        data: listFavorite,
        message: "Lấy danh sách yêu thích của người dùng thành công",
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


    

exports.deleteFavoriteProducts = async (req, res, next) => {
  const { _id } = req.user;
  const idProduct = req.body.idProduct;

  if (!idProduct) {
    return res.status(500).json({
      success: false,
      message: 'idProduct không hợp lệ',
    });
  }

  if (req.method === 'DELETE') {
    try {

      const listFavorite = await mdFavoriteProducts.FavoriteModel.findOne({ idUser: _id });

      if (!listFavorite) {
        return res.status(404).json({ success: false, data: {}, message: "Không tìm thấy danh sách yêu thích" });
      }


      const updatedList = listFavorite.idProduct.filter(productId => productId !== idProduct);
      
 
      listFavorite.idProduct = updatedList;
      await listFavorite.save();

      console.log(listFavorite.idProduct);
      return res.status(203).json({ success: true, data: {}, message: "Sản phẩm này không còn được yêu thích" });
    } catch (error) {
      return res.status(500).json({ success: false, data: {}, message: "Lỗi: " + error.message });
    }
  }
}
