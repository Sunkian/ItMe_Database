const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/itMe');

const restaurantSchema_ = new mongoose.Schema({
  name: String,
  placeId: {String, unique: true},
  type: String,
  address: String,
  priceLevel: Number,
  ratingGoogle: Number
});

const Restaurant_ = mongoose.model('Restaurant', restaurantSchema_);

const createRestaurant = async obj => {
  const doc = await Restaurant_.findOne({placeId: obj.placeId}).exec();
  if (doc) {
    return doc.toObject()._id;
  }

  return (await new Restaurant_(obj).save()).toObject()._id;
};

module.exports = {createRestaurant};
