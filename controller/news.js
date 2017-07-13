const mongoose = require('mongoose')
const News = mongoose.model('News')
const formidable = require('formidable');
const path = require('path');
const sd = require("silly-datetime");
const fs = require('fs')
const socket = 'http://127.0.0.1:3000'

// test
exports.test = function(req, res) {
  res.send("this is news test")
}

//新闻保存

exports.savenews = function(req,res){
	let news = req.body.news
	let one = new News(news)
	one.save(data=>{
		res.json({result:1,_id:one._id})
	})
	
}

//小图
exports.newsavatar = function(req,res){
	savepic(req,function(severPath){
		News.update({_id:req.query._id},{$set:{avatar:socket+severPath}})
		.then(result =>{
			console.log(result)
			res.json({result:1})
		})
	})
}

//返回咨询
exports.getnews = function(req,res){
	let _id = req.query._id
	News.findOne({_id})
	.then(data =>{
		res.json({result:1,data:data})
	})
}
//得到所有的咨询

exports.getAllNewsNumber = function(req,res){
	News.find({},{title:1})
	.then(result =>{
		res.json({number:result.length})
	})
	
}

exports.getAllNews = function(req,res){
	let count = req.query.count || 5;
	let page = req.query.page || 1;
	let start = count * (page -1)
	console.log(page)
	News.find({},{title:1,_id:1,avatar:1},{limit:count,skip:start})
	.then(data =>{
		res.json({result:1,data})
	})
}
exports.delnews = function(req,res){
	let _id = req.body._id
	News.remove({_id})
	.then(result => {
		res.json({result:1})
	})
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
      let severPath ="/carphoto/" + time + ran + extname
      let newName = path.join(__dirname,"../public" + severPath);
      fs.rename(oldName,newName,function(){
        cb(severPath)
      })

  })
}