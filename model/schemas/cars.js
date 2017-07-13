var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CarsSchema = new Schema({
  name: {
    type:String,
    unique: true,
  },
  avatar:String,
  display:[String],
  price:{
    refs:{
      down:Number,
      up:Number
    },
    gui:{
      down:Number,
      up:Number
    }
  },
  comment:[{
    type:ObjectId,
    ref:'Comment'
  }],
  parameter:{
    pl:[String],
    bsx:String,
    bx:String,
    yh:{
      up:Number,
      down:Number
    }
  },
  purchase:{
    yh:Number,
    dk:Number,
    uk:Number,
  },
  carType:[{
      vs:String,
      bsx:String,
      zdj:String,
      ckj:String
  }],
  pv: {
    type: Number,
    default: 0
  },
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

// var ObjectId = mongoose.Schema.Types.ObjectId
CarsSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

CarsSchema.statics = {
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

module.exports = CarsSchema