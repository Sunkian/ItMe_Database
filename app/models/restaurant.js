const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/itMe');

const restaurantSchema_ = new mongoose.Schema({
  name: String,
  type: String,
  address: String,
  priceLevel: Number,
  ratingGoogle: Number,
  placeId: String
});

const Restaurant_ = mongoose.model('Restaurant', restaurantSchema_);

const createRestaurant = obj => new Restaurant_(obj).save();

module.exports = {createRestaurant};
