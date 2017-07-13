let mongoose = require('mongoose');
let User = mongoose.model('User');
const formidable = require('formidable');
const path = require('path');
const sd = require("silly-datetime");
const fs = require('fs')
const socket = 'http://127.0.0.1:3000'
// test
exports.test = function(req, res) {
  res.send("this is user test")
}
//用户名重复校验

exports.checkName = function(req,res){
	let userName = req.body.name;
	console.log(userName)
	User.findOne({name: userName},  function(err, user) {
	    if (err) {
	      console.log(err)
	    }
	
	    if (user) {
	      return res.json({result:-1}) //用户名重复
	    }else {
	        res.json({result:1}) //用户名正确
	    }
	})
}
//有没有session

exports.testSession = function(req,res){
  if(req.session.user){
    res.json({result:1,userData:{username:req.session.user.name,avatar:req.session.user.avatar,role:req.session.user.role}})
  }else{
    res.json({result:-1})
  }
}


//注册
exports.signup = function(req, res) {
  let _user = req.body
  _user.role = 10;
  console.log(_user)
  //测试cookie
  // console.log(req.cookies)
  // res.cookie("test","xxx",{maxAge: 60000, httpOnly: true})

  //测试session
  // console.log(req.session.test)
  // req.session.test = "测试"
  user = new User(_user)
  user.save(function(err, user) {
    if (err) {
      console.log(err)
    }
    res.json({result:1})
  })
}

// 登陆
exports.signin = function(req, res) {
  let name = req.body.name
  let password = req.body.password
  User.findOne({name: name}, function(err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {
      return res.json({status:-1,message:"没有此用户"})
    }

    user.comparePassword(password, function(err, isMatch) {
    	console.log(isMatch);
      if (isMatch) {
        req.session.user = user;
        console.log(user);
        res.json({status:1,message:"登陆成功",userData:{name:user.name,role:user.role,avatar:user.avatar}})
      }
      else {
      	res.json({status:-2,message:"密码错误"})
        
      }
    })
  })
}

// logout
exports.logout =  function(req, res) {
  delete req.session.user
  //delete app.locals.user

  res.json({result:1})
}
//得到用户评论
exports.getusercomment = function(req,res){
  let username = req.session.user.name;
  User.findOne({name:username})
  .populate("comment","car content meta _id")
  .then(data =>{
    res.json({result:1,comments:data.comment})
  })
}


//uploadpassword

exports.uploadPassword = function(req,res){
  let username = req.session.user.name;
  let password = req.body.password;
  console.log(username,password)
  User.findOne({name:username})
  .then(user =>{
    user.password = password;
    user.save(res =>{
      res.json({result:1})
    })
  })
}
//头像修改
exports.uploadAvatar = function(req,res){
  let username = req.session.user.name;
  savepic(req,function(severPath){
    User.update({name:username},{$set:{avatar:socket+severPath}})
    .then(data=>{
      console.log(data)
      req.session.user.avatar = socket+severPath;
      res.json({result:1,avatar:socket+severPath})
    })
  })
}
// midware for user
exports.signinRequired = function(req, res, next) {
  let user = req.session.user
  if (user === undefined) {
    return res.json({result:-1})
  }

  next()
}

exports.adminRequired = function(req, res, next) {
  let user = req.session.user

  if (user.role <= 10) {
    return res.json({result:-2})
  }

  next()
}
function savepic(req,cb){
  let form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname ,'../uploads');
  form.parse(req,function(err,fields,files){
      if(err) {
          throw err;
          return;
      }
      let extname = path.extname(files.file.name)
      let time = sd.format(new Date(), 'YYYYMMDDHHmmss');

      let ran = parseInt(Math.random() * 89999 + 10000);
      let oldName = files.file.path;
      let severPath ="/avatar/" + time + ran + extname
      let newName = path.join(__dirname,"../public" + severPath);
      fs.rename(oldName,newName,function(){
        cb(severPath)
      })

  })
}