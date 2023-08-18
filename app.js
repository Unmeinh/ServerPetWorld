
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
require('dotenv').config();
var adminRouter= require('./routes/admin');
var usersRouter = require('./routes/user');
var usersShopRouter = require('./routes/userShop');
var blogsRouter = require('./routes/blog');
var accountRouter= require('./routes/account');
//api
var userApiRouter = require('./routes/api/userApi');
var blogApiRouter = require('./routes/api/blogApi');

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

app.use('/admin',adminRouter);
app.use('/user', usersRouter);
app.use('/user-shop', usersShopRouter);
app.use('/blog', blogsRouter);
app.use('/account',accountRouter );
//api
app.use('/api/user', userApiRouter);
app.use('/api/blog', blogApiRouter);
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
