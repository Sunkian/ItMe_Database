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

const createRating = async obj => {
  const doc = await Rating_.findOne({  //findOne : accès base de données, et await : on attend sa réponse.  doc = document. On regarde si on l'a, le rating
    restaurant: obj.restaurant, //On cherche en fct du user et du restaurant lié
    user: obj.user
  }).exec();
  if (doc) {
    doc.rating = obj.rating;  //Crée ou update un rating  doc.rating -> bdd , et obj.rating -> js. On prend le rating que la personne vient de mettre et on le met dans la bdd
    doc.save();  //On envoie la sauvegarde en bdd. On update l'ancien
    return;
  }
  return new Rating_(obj).save(); //On crée un nouveau si ya pas eu d'ancien
};

const getTheRating = obj =>
  Rating_.findOne(obj)
    .exec();

module.exports = {createRating, getTheRating};
