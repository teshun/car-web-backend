'use strict'
const express = require('express')
const user = require('../controller/user.js')
const cars = require('../controller/cars.js')
const comment = require('../controller/comment.js')
const news = require('../controller/news.js')
const index = require('../controller/index.js')
let router = express.Router()

//用户相关
router.post("/testsession",user.testSession);
router.post("/signup",user.signup);
router.post("/checkName",user.checkName);
router.post("/signin",user.signin);
router.post("/logout",user.logout);
router.post("/uploadpassword",user.signinRequired,user.uploadPassword);
router.post("/uploadavatar",user.signinRequired,user.uploadAvatar);
router.get("/getusercomment",user.signinRequired,user.getusercomment)

//汽车类型
router.post('/carstext',cars.carstext)
router.post('/changetext',cars.changeText)
router.post('/carsphoto',cars.carsphoto)
router.post('/carsdisplay',cars.carsdisplay)
router.get('/getcarinfo',cars.getcarinfo)
router.get('/getallcarinfo',cars.getallcarinfo)
router.get('/getsearch',cars.getsearch)

//评论相关
router.post('/comsave',user.signinRequired,comment.save);
router.get('/getcomment',comment.getcomment)
router.post('/delcom',user.signinRequired,comment.delcom)

//评论相关

router.post("/savenews",user.signinRequired,user.adminRequired,news.savenews)
router.post("/newsavatar",user.signinRequired,user.adminRequired,news.newsavatar)
router.get("/getnews",news.getnews)
router.get("/getallnews",news.getAllNews)
router.get("/getAllNewsNumber",news.getAllNewsNumber)
router.post("/delnews",user.signinRequired,user.adminRequired,news.delnews)
//首页
router.get("/indextest",index.test)
router.get("/getindexCarlist",index.getCarlist)
router.post("/getpicpath",index.getpicpath)
router.post("/hotadd",user.signinRequired,user.adminRequired,index.hotadd)
router.post("/delhot",user.signinRequired,user.adminRequired,index.delhot)
module.exports = router