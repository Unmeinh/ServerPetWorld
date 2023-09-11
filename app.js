require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var adminRouter= require('./routes/admin');
var usersRouter = require('./routes/user');
var usersShopRouter = require('./routes/userShop');
var blogsRouter = require('./routes/blog');
var accountRouter= require('./routes/account');
var productRouter = require('./routes/product');
var categoryProduct = require('./routes/categoryProduct');
var petRouter = require('./routes/pet');
var shopRouter = require('./routes/shop');
//api
var userApiRouter = require('./routes/api/userApi');
var blogApiRouter = require('./routes/api/blogApi');
var itemCartApiRouter = require('./routes/api/itemCartApi');
var productApiRouter = require('./routes/api/productApi');
var shopApiRouter = require('./routes/api/shopApi');
var CatAllApiRouter = require('./routes/api/categoryAll');
var petApiRouter = require('./routes/api/petApi');
var savenoticeRouter= require('./routes/api/noticeApi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.KEY_LOGIN_ADMIN,
  resave: false,
  saveUninitialized: true
}))
app.use('/',blogsRouter);
app.use('/admin',adminRouter);
app.use('/user', usersRouter);
app.use('/user-shop', usersShopRouter);
app.use('/blog', blogsRouter);
app.use('/account',accountRouter );
app.use('/product', productRouter);
app.use('/category-product', categoryProduct);
app.use('/pet', petRouter);
app.use('/shop', shopRouter);

//api
app.use('/api/user', userApiRouter);
app.use('/api/blog', blogApiRouter);
app.use('/api/item-carts', itemCartApiRouter);
app.use('/api/product', productApiRouter);
app.use('/api/shop', shopApiRouter);
app.use('/api/category', CatAllApiRouter);
app.use('/api/pet', petApiRouter);
app.use('/api/notice',savenoticeRouter)

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if(req.originalUrl.indexOf('/api')==0)
  {
    res.json({
      success:false,
      msg:err.message,
      status:err.status
    })
  }
  else{
    res.render('error');
  }
  
});

module.exports = app;
