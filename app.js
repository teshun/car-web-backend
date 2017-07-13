const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
// var cookieParser = require('cookie-parser'); //测试跨域cookie
const fs = require('fs')
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser')
const dbUrl = 'mongodb://localhost/design'

const app = express()
mongoose.connect(dbUrl)

mongoose.Promise = global.Promise;

app.all('/*',(req,res,next)=>{
	//设置允许跨域响应报文头
		//设置跨域
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  // res.header('Access-Control-Allow-Credentials', true);
	res.header("Access-Control-Allow-Methods","*");
	// res.setHeader('Content-Type','application/json;charset=utf-8');
	next();
});
app.use(express.static(path.join(__dirname, "./public")))
app.use(bodyParser({limit: '50mb'})) //针对富文本编辑的图片
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
// app.use(cookieParser());  //测试跨域的cookie
//使用session
app.use(session({
    secret: 'keyboard',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({           //设置回话持久化
      url: dbUrl,
      ttl: 24 * 60 * 60
    })
}));

var models_path = __dirname + '/model/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)

const apiRoute = require('./router/router.js');
app.use('/api',apiRoute);

app.listen(3000)