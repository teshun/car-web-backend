var mongoose = require('mongoose')
var CarsSchema = require('../schemas/cars.js')
var Cars = mongoose.model('Cars', CarsSchema)

module.exports = Cars