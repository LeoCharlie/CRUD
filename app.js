var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//引入数据库配置文件
var settings = require("./setting");
//flash模块
var flash = require("connect-flash");
//支持会话
var session = require("express-session");
//将会话保存在mongodb中
var MongoStore = require("connect-mongo")(session);
//引入数据库实例
var db = require("./models/db");
//添加路由文件
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(session({
//    防止篡改cookie
    secret: settings.cookieSecret,
//    设置值
    key: settings.db,
//    cookie的生命周期
    cookie:{maxAge: 1000*60*60*24*30},
//    将session的信息存储到数据库当中去
    store:new MongoStore({
        url: 'mongodb://localhost/db'
    }),
    //是否强制保存会话
    resave:false,
    //会话未修改的时候，是否保存
    saveUninitialized:true
}));

//将app传递给路由
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//监听
app.listen(4444,function () {
    console.log('node is ok');
})
module.exports = app;
