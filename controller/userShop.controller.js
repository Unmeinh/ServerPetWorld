let mdUserShop = require('../model/userShop.model');
const fs = require("fs");

const { format } = require('date-fns');
const currentDate = new Date();

exports.listUserShop = async (req, res, next) => {
  const perPage = 7;
  let msg = '';
  let filterSearch = {};
  let currentPage = parseInt(req.query.page) || 1;

  if (req.method == 'GET') {
    try {
      if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
        // Use a regex to match any username containing the search input character(s)
        const searchTerm = req.query.filterSearch.trim();
        filterSearch = { userName: new RegExp(searchTerm, 'i') };
      }

      let sortOption = {};
      const selectedSortOption = req.query.sortOption;
      if (selectedSortOption === 'az') {
        sortOption = { userName: 1 }; // 1 for ascending order (A-Z)
      } else if (selectedSortOption === 'za') {
        sortOption = { userName: -1 }; // -1 for descending order (Z-A)
      }

      const totalCount = await mdUserShop.UserShopModel.countDocuments(filterSearch);
      const totalPages = Math.ceil(totalCount / perPage);

      // Validate the current page number to stay within the correct range
      if (currentPage < 1) currentPage = 1;
      if (currentPage > totalPages) currentPage = totalPages;

      const skipCount = (currentPage - 1) * perPage;
      let listUserShop = await mdUserShop.UserShopModel.find(filterSearch)
        .sort(sortOption)
        .skip(skipCount)
        .limit(perPage);

      msg = 'Lấy danh sách user shop thành công';
      return res.render('UserShop/listUserShop', {
        listUserShop: listUserShop,
        countNowUserShop: listUserShop.length,
        countAllUserShop: totalCount,
        msg: msg,
        currentPage: currentPage,
        totalPages: totalPages,
      });
    } catch (error) {
      msg = '' + error.message;
      console.log('Không lấy được danh sách user shop: ' + msg);
    }
  }
};

exports.addUserShop = async (req, res, next) => {
    let msg='';
    if(req.method=='POST')
    {
      if(req.body.confirmmatkhau!= req.body.matkhau)
        {
            msg="Mật khẩu không trùng khớp";
            return res.render('UserShop/addUserShop',{msg:msg});
        }

        let newObj = new mdUserShop.UserShopModel();
        newObj.fullName = req.body.tendaydu;
        newObj.userName = req.body.tendangnhap;
        newObj.passWord = req.body.matkhau;
        newObj.email = req.body.email;
        newObj.createdAt =outputdate ;
        if (req.file) {
            fs.renameSync(req.file.path, './public/upload/' + req.file.originalname);
            console.log("url:http://localhost:3000/upload/" + req.file.originalname);
            newObj.avatarShopUS = "http://localhost:3000/upload/" + req.file.originalname;
        } else {
            // Set a default image URL if the user didn't upload an image
            newObj.avatarShopUS = "http://localhost:3000/default-avatar.png";
        } 
        try {
            await newObj.save();
            message = 'Thêm người dùng shop thành công!';
            return res.redirect('/user-shop');
        } catch (error) {
            console.log(error.message);
             if(error.message.match(new RegExp('.+`usernameShopUS` is require+.')))
            {
                msg='Tên đăng nhập đang trống!';
            }
            else if(error.message.match(new RegExp('.+`emailShop` is require+.')))
            {
                msg='Email đang trống!';
            }
            // else if (!isValidEmail(req.body.email)) {
            //     msg = "Email không hợp lệ";
            //   }
            else if(error.message.match(new RegExp('.+`fullname` is require+.')))
            {
                msg='Tên đầy đủ đang trống!';
            }
            else if(error.message.match(new RegExp('.+`passwordShopUS` is require+.')))
            {
                msg='Mật khẩu đang trống!';
            }
            else if(error.message.match(new RegExp('.+index: usernameShopUS+.')))
            {
                msg= 'Người dùng shop đã tồn tại - Nhập lại usernameShopUS!';
            }
            else if(error.message.match(new RegExp('.+index: emailShop+.')))
            {
                msg='Email đã tồn tại - Nhập lại email!';
            }
           
            else{
                msg=error.message;
            }
           
        }

    }
    res.render('UserShop/addUserShop',{msg:msg});
}
function isValidEmail(email) {
    // Regular expression to match email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Test the email against the regex
    return emailRegex.test(email);
  }

exports.deleteUserShop = async (req, res, next) => {
  try {
    const idUS = req.params.idUS; // Assuming idUS is the parameter for the user shop ID
    const deletedUserShop = await mdUserShop.UserShopModel.findByIdAndDelete(idUS);

    if (deletedUserShop) {
      // User shop was deleted successfully
      res.redirect('/user-shop'); // Redirect to the user shop list page
    } else {
      // User shop with the given ID was not found
      res.render('UserShop/deleteUserShop', { msg: 'User shop not found' });
    }
  } catch (error) {
    console.error('Error deleting user shop:', error);
    res.render('UserShop/deleteUserShop', { msg: 'Error deleting user shop' });
  }
};
exports.detailUserShop = async (req, res, next) => {
  let msg='';
  let idUS = req.params.idUS;
 let objUS = await mdUserShop.UserShopModel.findById(idUS);
  res.render('UserShop/detailUserShop',{objUS:objUS});
  console.log("objjjjj"+objUS);
}
function datetime(){
  let dt = new Date() ;
  let date = ("0"+ dt.getDate()).slice(-2) ;
  let month = ("0"+ (dt.getMonth()+1)).slice(-2);
  let year = dt.getFullYear();
  let hours = dt.getHours() ;

  var outputdate = year +"-" + month+"-"+ date+"-" + hours
  return outputdate ;
}