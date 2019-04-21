const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/itMe');

const {ObjectId} = mongoose.Schema.Types;
const ratingSchema_ = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'},
  restaurant: {type: ObjectId, ref: 'Restaurant'},
  rating: String,
  date: {type: Date, default: new Date()}
});

const Rating_ = mongoose.model('Rating', ratingSchema_);

const createRating = async obj => {
  const doc = await Rating_.findOne({
    restaurant: obj.restaurant,
    user: obj.user
  }).exec();
  if (doc) {
    doc.rating = obj.rating;
    doc.save();
    return;
  }

  return new Rating_(obj).save();
};

const getTheRating = obj =>
  Rating_.findOne(obj)
    .populate('restaurant')
    .exec();

module.exports = {createRating, getTheRating};
