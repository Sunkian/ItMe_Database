const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/itMe');

const restaurantSchema_ = new mongoose.Schema({
  name: String,
  placeId: {type: String, unique: true},
  type: String,
  address: String,
  priceLevel: Number,
  ratingGoogle: Number
});

const Restaurant_ = mongoose.model('Restaurant', restaurantSchema_); // Déclaration du modèle pour s'en servir après

const createRestaurant = async obj => {
  // On définit une fonction pour créer nos restaurants, les acces à la bdd mongo sont asynchrons (définit comme ça)
  const doc = await Restaurant_.findOne({placeId: obj.placeId}).exec(); // On cherche si on trouve pas dans la bdd le placeId qui nous a été donné
  if (doc) {
    // Evitons les doublons, et
    return doc.toObject()._id; // Si on trouve, on renvoit son id
  }

  return (await new Restaurant_(obj).save()).toObject()._id; // Si on trouve pas, on le crée et on renvoit l'id généré par mongo
  // On check s'il est là, auquel cas on récupère le placeId sinon on le crée, mais dans le deux cas on a un placeId renvoyé
};

module.exports = {createRestaurant};
