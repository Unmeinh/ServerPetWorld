let mdVoucherShop = require('../../model/voucherShop.model');


exports.listVoucherShop = async (req, res, next) => {
  if (req.method == 'GET') {
      let listVoucherShop = await mdVoucherShop.VoucherShopModel.find().populate('idShop');
      if (listVoucherShop) {
          return res.status(200).json({ success: true, data: listVoucherShop, message: 'Lấy danh sách Voucher thành công' });
      }
      else {
          return res.status(500).json({ success: false, data: [], message: 'Không lấy được danh sách Voucher' });
      }
  }
}

function validateVoucherData(voucherData) {
  const message = [];

  if (!voucherData.nameVoucher || voucherData.nameVoucher.trim().length === 0) {
    message.push('Vui lòng không bỏ trống tên voucher!');
  }

  if (!voucherData.discount || voucherData.discount.trim().length === 0) {
    message.push('Vui lòng không bỏ trống discount!');
  }

  if (!voucherData.moneyLimit || voucherData.moneyLimit.trim().length === 0 ) {
    message.push('Vui lòng không bỏ trống số tiền tối thiểu!');
  }

  if (!voucherData.idShop || voucherData.idShop.trim().length === 0) {
    message.push('Vui lòng không bỏ trống !');
  }

  // Kiểm tra các điều kiện khác cần thiết
  return message;
}

exports.addVoucherShop = async (req, res, next) => {
  let msg = '';
  const voucherErrors = validateVoucherData(req.body);

  if (voucherErrors.length > 0) {
 // Xử lý lỗi nếu có
 return res.status(400).json({  message: voucherErrors });
}
  // Generate a random codeVoucher
  function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }

  const newObjVoucher = new mdVoucherShop.VoucherShopModel();
  newObjVoucher.nameVoucher = req.body.nameVoucher;
  newObjVoucher.codeVoucher = generateRandomCode(8); 
  newObjVoucher.discount = req.body.discount;
  newObjVoucher.moneyLimit = req.body.moneyLimit;
  newObjVoucher.idShop = req.body.idShop;
  newObjVoucher.createdAt = new Date();

  
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 30);// + 30 ngày sau thì hết hạn
  newObjVoucher.expiedAt = expirationDate;



  try {
    await newObjVoucher.save();

    return res.status(200).json({ success: true, data: newObjVoucher, message: 'Thêm voucher thành công!' });
  } catch (error) {
    console.log(error.message);

    msg = error.message;
    return res.status(500).json({ success: false, data: {}, message: msg });
  }
}
