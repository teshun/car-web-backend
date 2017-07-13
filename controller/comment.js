var mongoose = require('mongoose')
var Comment = mongoose.model('Comment')
var Cars = mongoose.model('Cars')
var User = mongoose.model('User')

// test
exports.test = function(req, res) {
  res.send("this is comment test")
}
//评论保存
exports.save = function(req, res) {
  console.log(req.body)
  let carname = req.body.car
  let content = req.body.content
  let userid = req.session.user._id
  let com = new Comment({content})
  let user =''
  User.findOne({_id:userid})
  .then(data => {
    user = data;
    return Cars.findOne({name:carname})
  }).then(car =>{
    car.comment.push(com._id)
    user.comment.push(com._id)
    com.car = carname
    com.from = user._id
    return Promise.all([com.save(),car.save(),user.save()])
  }).then(result =>{
    res.json({result:1})
  }).catch(err =>{
    console.log(err)
    res.json({result:-2})
  })
}

exports.getcomment = function(req,res){
  let carname = req.query.carname
  Comment.find({car:carname})
  .sort({'meta.createAt':1})
  .populate("from","name avatar")
  .then(result =>{
    // console.log(result[0].from.name)
    let conments = result.map(function(v){
      return {
        username:v.from.name,
        avatar:v.from.avatar,
        content:v.content,
        _id:v._id,
        car:v.car
      }
    })
    res.json({result:1,conments})
  })
  
}

//删除评论
exports.delcom = function(req,res){
  let username = req.body.username
  let _id = req.body._id
  let carname = req.body.carname
  let userPro = User.findOne({name:username})
  let carPro = Cars.findOne({name:carname})
  
  Promise.all([userPro,carPro])
  .then(([user,car]) => {
    user.comment.splice(user.comment.indexOf(_id),1)
    car.comment.splice(car.comment.indexOf(_id),1)
    return Promise.all([user.save(),car.save(),Comment.remove({_id})])
  }).then(result=>{
    console.log(result)
    res.json({result:1})
  })
}