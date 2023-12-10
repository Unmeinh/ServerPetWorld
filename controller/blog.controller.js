let mdBlog = require("../model/blog.model");
let mdUserAcc = require("../model/userAccount.model");
let moment = require("moment");
let fs = require("fs");
let hashFunction = require("../function/hashFunction");

exports.listAllBlog = async (req, res, next) => {
  let msg = "";
  let filterSearch = null;
  let sortOption = null;
  let perPage = 10;
  let currentPage = parseInt(req.query.page) || 1;

  if (req.method == "GET") {
    try {
      if (
        typeof req.query.filterSearch !== "undefined" &&
        req.query.filterSearch.trim() !== ""
      ) {
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { contentBlog: new RegExp(searchTerm, "i") };
      }
      if (typeof req.query.sortOption != "undefined") {
        sortOption = { contentBlog: req.query.sortOption };
      }

      let totalCount = await mdBlog.BlogModel.countDocuments(filterSearch);
      const totalPage = Math.ceil(totalCount / perPage);

      if (currentPage < 1) currentPage = 1;
      if (currentPage > totalPage) currentPage = totalPage;
      let skipCount = (currentPage - 1) * perPage;

      let listAllBlog = await mdBlog.BlogModel.find(filterSearch)
        .populate("idUser")
        .sort(sortOption)
        .skip(skipCount)
        .limit(perPage);
      msg = "Lấy danh sách tất cả blog thành công";
      // console.log(listAllBlog);
      return res.render("Blog/listBlog", {
        listAllBlog: listAllBlog,
        countAllBlog: totalCount,
        countNowBlog: listAllBlog.length,
        msg: msg,
        moment: moment,
        currentPage: currentPage,
        totalPage: totalPage,
        adminLogin: req.session.adLogin,
      });
    } catch (error) {
      msg = "Lỗi: " + error.message;
      console.log(msg);
    }
  }
};
// exports.listBlogFromIdUser = async (req, res, next) => {
//     let idUser = req.params.idUser;

//     let listBlogUser = await mdBlog.BlogModel.find({ idUser: idUser }).populate('idUser');
//     res.render('');
// }
exports.detailBlog = async (req, res, next) => {
  let idBlog = req.params.idBlog;
  let objB = await mdBlog.BlogModel.findById(idBlog).populate("idUser");
  let idAccount = objB.idUser.idAccount;
  let objUserAcc = await mdUserAcc.UserAccountModel.findById(idAccount);
  res.render("Blog/detailBlog", {
    objB: objB,
    objUserAcc: objUserAcc,
    moment: moment,
    adminLogin: req.session.adLogin,
  });
};

exports.deleteBlog = async (req, res, next) => {
  let msg = "";
  let idBlog = req.params.idBlog;
  let objB = await mdBlog.BlogModel.findById(idBlog).populate("idUser");
  // console.log("objB: "+ objB);
  if (req.method == "POST") {
    try {
      await mdBlog.BlogModel.findByIdAndDelete(idBlog);
      msg = "Xóa bài viết thành công";
      return res.redirect("/blog");
    } catch (error) {
      msg = "Xóa bài viết thất bại ";
      console.log(msg + error.message);
    }
  }
  res.render("Blog/deleteBlog", {
    objB: objB,
    msg: msg,
    adminLogin: req.session.adLogin,
  });
};

exports.shareBlog = async (req, res, next) => {
  if (req.params.idBlog) {
    let idBlog = hashFunction.decodeFromAscii(req.params.idBlog);
    let blog = await mdBlog.BlogModel.findById(idBlog);
    let imageUrl = "";
    if (blog.imageBlogs.length > 0) {
      let image = blog.imageBlogs[0];
      let urlWithoutType = image.substring(0, image.lastIndexOf("."));
      urlWithoutType =
        urlWithoutType.substring(0, urlWithoutType.lastIndexOf("blog")) +
        "blogHDScale" +
        urlWithoutType.substring(urlWithoutType.lastIndexOf("/"));
      imageUrl = urlWithoutType + "_HDScale.jpg";
    } else {
      imageUrl =
        "https://res.cloudinary.com/dcf7f43rh/image/upload/v1695556234/images/logo/s2vq9g9kmy10wxvmeekc.jpg";
    }
    return res.render("Blog/shareBlog", {
      blog: blog,
      contentBlog: blog.contentBlog,
      imageBlog: imageUrl,
      adminLogin: req.session.adLogin,
    });
  }
  res.render("Blog/shareBlog");
};
