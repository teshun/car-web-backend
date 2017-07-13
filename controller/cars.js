const mongoose = require('mongoose')
const formidable = require('formidable');
const sd = require("silly-datetime");
const path = require('path')
const Cars = mongoose.model('Cars')
const fs = require('fs')
const socket = 'http://127.0.0.1:3000'
// 接受汽车基本类型
exports.carstext = function(req, res) {
  let data = req.body;
  console.log(data)
  let car = new Cars(data);
  car.save(function(err,data){
    console.log(err)
    req.session.car = req.body.name
    res.json(data)
  })
}
//修改汽车文本信息
exports.changeText = function(req, res) {
  let data = Object.assign({},req.body);
  let name = data.oldname
  delete data.oldname
  // console.log(data)
  Cars.update({name},{$set:data})
  .then(result =>{
    console.log(result)
    res.json({result:1})
  }).catch(err=>{
    console.log(result)
    res.json({result:-1})
  })

}
//左上角图
exports.carsphoto = function(req,res){
  let carname = req.session.car;
  // console.log(carname)
  savepic(req,function(severPath){
    Cars.update({name:carname},{$set:{avatar:socket+severPath}})
    .then(function(data){
      // console.log(data)
      res.json({result:1})
    })
  })
}

//展示图片
exports.carsdisplay = function(req,res){
  let carname = req.session.car;
  // console.log(carname)
  savepic(req,function(severPath){
    Cars.update({name:carname},{$push:{display:socket+severPath}})
    .then(function(data){
      // console.log(data)
      res.json({result:1})
    })
  })
}

//保存图片
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
//得到汽车基本信息
exports.getcarinfo = function(req,res){
  let car = req.query.name;

  Cars.findOne({name:car})
  .then(function(result){
    console.log(result);
    if(result == null){
      res.json({result : -1})
    }
    res.json({result})
  })
}

//汽车搜索功能

exports.getsearch = function(req,res){
  let carname = req.query.carname;
  console.log(carname)
  var reg = new RegExp(carname,"i")
  Cars.find({"name": reg})
  .then(result =>{
    res.json({result})
  })
}

exports.getallcarinfo = function(req,res){
  Cars.find({},{name:1,avatar:1},{sort:{name:1}})
  .then(data=>{
    res.json({result:1,data})
  })
}