let mongoose = require('mongoose')
var crypto = require("crypto");
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let UserSchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  // 0: nomal user
  // 1: verified user
  // 2: professonal user
  // >10: admin
  // >50: super admin
  role: {
    type: Number,
    default: 0
  },
  comment:[{
      type:ObjectId,
      ref:'Comment'
  }],
  avatar:String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

UserSchema.pre('save', function(next) {
  let user = this

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }
  if(/==$/.test(user.password) == false){
    console.log("pass have change")
    user.password = md5(user.password)
    user.avatar = 'http://127.0.0.1:3000/avatar/hahaha.jpg'
  }
  
  next();
})

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    cb( null,md5(_password) == this.password)
  }
}

UserSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}
function md5(mingma){
  var md5 = crypto.createHash('md5');
  var password = md5.update(mingma).digest('base64');
  return password;
}
module.exports = UserSchema