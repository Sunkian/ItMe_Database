const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/itMe');

const userSchema_ = new mongoose.Schema({
  email: {type: String, unique: true},
  password: String,
  age: Number,
  gender: String
});

const User_ = mongoose.model('User', userSchema_);

const createUser = obj => new User_(obj).save();

const logUser = obj => User_.findOne(obj).exec();

module.exports = {createUser, logUser};
