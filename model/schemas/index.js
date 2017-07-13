var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var IndexSchema = new Schema({
  display:{
    downeight:[String],
    eightToTwelve:[String],
    twelveToEighteen:[String],
    eighteenToTwentyfive:[String],
    twentyfiveToForty:[String],
    upForty:[String],
    newcar:[String],
    usedcar:[String]
  },
  hot:[{
    carname:String,
    desc:String,
    picpath:String,
    price:String
  }],
  name:String,
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
IndexSchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

IndexSchema.statics = {
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

module.exports = IndexSchema