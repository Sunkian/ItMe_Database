const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/itMe');

const {ObjectId} = mongoose.Schema.Types;
const ratingSchema_ = new mongoose.Schema({
  user: {type: ObjectId, ref: 'User'},
  restaurant: {type: ObjectId, ref: 'Restaurant'},
  rating: Number,
  date: {type: Date, default: new Date()}
});

const Rating_ = mongoose.model('Rating', ratingSchema_);

const createRating = obj => new Rating_(obj).save();
const getTheRating = obj => Rating_.findOne(obj).populate("restaurant").exec();

module.exports = {createRating, getTheRating};
