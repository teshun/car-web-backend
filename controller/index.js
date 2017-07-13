const mongoose = require('mongoose')
const Index = mongoose.model('Index')
const formidable = require('formidable');
const path = require('path');
const sd = require("silly-datetime");
const fs = require('fs')
const socket = 'http://127.0.0.1:3000'

// test
exports.test = function(req, res) {
  
  res.send("this is index test")
}
exports.getCarlist = function(req,res){
  Index.findOne({name:'首页'})
  .then(data => {
    res.json({result:1,data})
  })
}
exports.getpicpath = function(req,res){
  savepic(req,severPath => {
    res.json({result:1,path:socket+severPath})
  })
}
exports.delhot = function(req,res){
  let _id = req.body._id
  Index.update({name:'首页'},{$pull:{"hot":{_id}}})
  .then(result =>{
    console.log(result)
    res.json({result:1})
  })
}

exports.hotadd = function(req,res){
  let data = req.body.data
  console.log(data)
  Index.update({"name":'首页'},{'$push':{hot:data}}).then(result =>{
    console.log(result)
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