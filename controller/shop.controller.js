let mdShop = require('../model/shop.model');
var moment = require('moment');
const jwt = require('jsonwebtoken');
const string_word_secret = process.env.TOKEN_SEC_KEY;
const {decodeFromSha256, decodeFromAscii} = require('../function/hashFunction');
const fs = require('fs');
const { sendFCMNotification } = require('../function/notice');

exports.listShop = async (req, res, next) => {
  const perPage = 7;
  let msg = '';
  let filterSearch = null;
  let sortOption = null;
  let currentPage = parseInt(req.query.page) || 1;

  if (req.method == 'GET') {
    try {
      if (
        typeof req.query.filterSearch !== 'undefined' &&
        req.query.filterSearch.trim() !== ''
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = {
          $or: [
            {nameShop: {$regex: searchTerm, $options: 'i'}},
            {email: {$regex: searchTerm, $options: 'i'}},
          ],
        };
      }

      if (typeof req.query.sortOption != 'undefined') {
        sortOption = {fullName: req.query.sortOption};
      }

      const totalCount = await mdShop.ShopModel.countDocuments(filterSearch);
      const totalPages = Math.ceil(totalCount / perPage);

      if (currentPage < 1) currentPage = 1;
      if (currentPage > totalPages) currentPage = totalPages;

      const skipCount = (currentPage - 1) * perPage;
      let listShop = await mdShop.ShopModel.find({
        ...filterSearch,
        status: 1, // Thêm điều kiện trạng thái
      })
        .sort(sortOption)
        .skip(skipCount)
        .limit(perPage);
      msg = 'Lấy danh sách shop thành công';
      return res.render('Shop/listShop', {
        listShop: listShop,
        countNowShop: listShop.length,
        countAllShop: totalCount,
        msg: msg,
        currentPage: currentPage,
        totalPages: totalPages,
        moment: moment,
        adminLogin: req.session.adLogin,
      });
    } catch (error) {
      msg = '' + error.message;
      console.log('Không lấy được danh sách Shop: ' + msg);
    }
  }
  res.render('Shop/listShop', {msg: msg, adminLogin: req.session.adLogin});
};

exports.listShopConfirm = async (req, res, next) => {
  const perPage = 7;
  let msg = '';
  let filterSearch = null;
  let sortOption = null;
  let currentPage = parseInt(req.query.page) || 1;

  if (req.method == 'GET') {
    try {
      if (
        typeof req.query.filterSearch !== 'undefined' &&
        req.query.filterSearch.trim() !== ''
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = {
          $or: [
            {nameShop: {$regex: searchTerm, $options: 'i'}},
            {email: {$regex: searchTerm, $options: 'i'}},
          ],
        };
      }

      if (typeof req.query.sortOption != 'undefined') {
        sortOption = {fullName: req.query.sortOption};
      }

      const totalCount = await mdShop.ShopModel.countDocuments(filterSearch);
      const totalPages = Math.ceil(totalCount / perPage);

      if (currentPage < 1) currentPage = 1;
      if (currentPage > totalPages) currentPage = totalPages;

      const skipCount = (currentPage - 1) * perPage;
      let listShop = await mdShop.ShopModel.find({
        ...filterSearch,
        status: 0, // Thêm điều kiện trạng thái
      })
        .sort(sortOption)
        .skip(skipCount)
        .limit(perPage);
      msg = 'Lấy danh sách shop thành công';
      return res.render('Shop/confirmShop', {
        listShop: listShop,
        countNowShop: listShop.length,
        countAllShop: totalCount,
        msg: msg,
        currentPage: currentPage,
        totalPages: totalPages,
        moment: moment,
        adminLogin: req.session.adLogin
      });
    } catch (error) {
      msg = '' + error.message;
      console.log('Không lấy được danh sách Shop: ' + msg);
    }
  }
  // If no search results are found, render a message
  res.render('Shop/confirmShop', {msg: msg, adminLogin: req.session.adLogin });
};
exports.detailShop = async (req, res, next) => {
  let idShop = req.params.idShop;
  let ObjShop = await mdShop.ShopModel.findById(idShop);
  res.render('Shop/detailShop', {
    ObjShop: ObjShop,
    moment: moment,
    adminLogin: req.session.adLogin
  });
};

exports.detailOwner = async (req, res, next) => {
  let idShop = req.params.idShop;
  let ObjShop = await mdShop.ShopModel.findById(idShop);
  let objOwner = {};

  if (ObjShop) {
    const data = jwt.verify(ObjShop.ownerIdentity, string_word_secret);
    if (data) {
      if (data._id == idShop) {
        let encodeOwnerIdentity = data.ownerIdentity;
        let decodeData = await decodeFromAscii(encodeOwnerIdentity);
        let decodeObj = {...JSON.parse(decodeData)};
        let images = [];
        for (let i = 0; i < decodeObj.imageIdentity.length; i++) {
          const image = decodeFromSha256(decodeObj.imageIdentity[i]);
          images.push(image);
        }
        decodeObj.imageIdentity = [...images];
        decodeObj.nameIdentity = decodeFromSha256(decodeObj.nameIdentity);
        decodeObj.numberIdentity = decodeFromSha256(decodeObj.numberIdentity);
        decodeObj.dateIdentity = decodeFromSha256(decodeObj.dateIdentity);
        objOwner = {...decodeObj};
      }
    }
  }
  res.render('Shop/detailOwner', {
    objOwner: objOwner,
    moment: moment,
    adminLogin: req.session.adLogin
  });
};

/** Update Confirm shop */
exports.updateShopStatus = async (req, res, next) => {
  let message = '';
  let idShop = req.params.idShop;
  let ObjShop = await mdShop.ShopModel.findById(idShop);
  if (req.method == 'POST') {
    try {
      await mdShop.ShopModel.findByIdAndUpdate(ObjShop._id, {status: 1});
      // Send notify SUCCESS for shop
      await sendFCMNotification (
          ObjShop.tokenDevice,
          `Quản trị viên đã phê duyệt tài khoản của bạn!`,
          `Chúc mừng ${ObjShop.nameShop}, bạn đã trở thành cửa hàng trong hệ thống của chúng tôi!`,
          'SELLER',
          null,
          ObjShop._id,
      );
      return res.redirect('/shop/confirm');
    } catch (error) {
      message = error.message;
      console.log(message);
    }
  }
  res.render('Shop/updateShop', {message: message, ObjShop: ObjShop, adminLogin: req.session.adLogin});
};

/** Update hide shop not confirm */
exports.updateHideShopStatus = async (req, res, next) => {
  let message = '';
  let idShop = req.params.idShop;
  let ObjShop = await mdShop.ShopModel.findById(idShop);
  if (req.method == 'POST') {
    try {
      await mdShop.ShopModel.findByIdAndUpdate(idShop, {status: -1});
      // Send notify FAILED for shop
      await sendFCMNotification (
          ObjShop.tokenDevice,
          `Quản trị viên đã từ chối tài khoản của bạn!`,
          `Xin lỗi ${ObjShop.nameShop}, bạn chưa đủ điều kiện để trở thành cửa hàng trong hệ thống của chúng tôi!`,
          'SELLER',
          null,
          ObjShop._id,
      );
      return res.redirect('/shop/confirm');
    } catch (error) {
      message = error.message;
      console.log(message);
    }
  }
  res.render('Shop/deleteShop', {
    message: message,
    ObjShop: ObjShop,
    adminLogin: req.session.adLogin
  });
};
