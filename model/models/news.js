var mongoose = require('mongoose')
var NewsSchema = require('../schemas/News.js')
var News = mongoose.model('News', NewsSchema)

module.exports = News