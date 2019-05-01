const R = require('ramda');
const computeCosineDistance = require('compute-cosine-distance');

// COSINE DISTANCE
const getDistance = R.curry((profileList, person) => {
  // Person : on peut prendre n'importe quelle personne dans la base de données en référence, au lieu de prendre la premiere automatiquement
  const distance = R.map(
    x => [x, computeCosineDistance(person, x)],
    profileList
  ); // On compare le 1er profile avec les autres
  // return distance.sort((a, b) => a - b);
  return R.sortBy(R.nth(1), distance); // Case 0 c'est le gros vecteur profil et le 1 c'est la distance, donc on classe par rapport à la distance en croissant
});

module.exports = {getDistance};
