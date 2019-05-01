const R = require('ramda');
const {getDistance} = require('./distance');
const {getRatingsForUser, getAllRatings} = require('./models/rating');

const makePriceLevelMean_ = R.pipe(
  R.map(R.path(['restaurant', 'priceLevel'])), // On part chercher les priceLevel de chaque restaurant par notation
  R.mean
);

const makePersonalRatingMean_ = R.pipe(
  R.pluck('rating'),
  R.mean
);

const makeDeltaMean_ = R.pipe(
  R.map(
    // Appliquons à tous les élements du vecteur les changements suivants
    R.converge(R.subtract, [
      R.path(['restaurant', 'ratingGoogle']),
      R.prop('rating')
    ])
  ),
  R.mean
);

const createUserProfile = x => {
  // Il va chercher chacun des users un par un (x est un user)
  const priceLevelMean = makePriceLevelMean_(x);

  const personalRatingMean = makePersonalRatingMean_(x); // Rating moyen de la personne, savoir si la personne note plutot bien ou plutot mal

  const deltaMean = makeDeltaMean_(x);

  const userage = R.path(['0', 'user', 'age'], x); // On indique le chemin pour aller chercher l'age,
  const usergender = R.path(['0', 'user', 'gender'], x) === 'male' ? 1 : 2; // On indique le chemin pour aller chercher le gender, vu que c'est un string, on le change en int de cette maniere
  return [
    priceLevelMean,
    0.01 * userage,
    usergender,
    2 * personalRatingMean,
    10 * deltaMean
  ];
};

const createUserInput = async profileToCompare => {
  // On veut calculer le cosine distance entre deux users pour établir une similarité
  const ratingList = await getAllRatings();
  const byId = R.groupBy(R.path(['user', '_id']), ratingList);

  // IL faut aller chercher le priceLevelMean, l'age et le gender pour l'instant
  const profileList = R.map(createUserProfile, byId); // Ca nous renvoie une seule personne à la fois
  const distanceList = getDistance(R.values(profileList), profileToCompare); // <- on crée une personne
  const userList = R.pipe(
    // Ca nous donne les 3 premieres personnes
    R.slice(0, 3),
    R.pluck(0),
    R.unnest
  )(distanceList); // On a plus besoin de la distance donc on fait à partir de l'élément 0 du tableau
  const fivePercentSimilar = R.pipe(
    R.pluck(1),
    R.filter(R.gte(0.05)),
    R.length
  )(distanceList);
  return [...userList, fivePercentSimilar]; // Renvoie un vecteur, plus ou moins concaténé
};

const createUserInputFromId = R.pipe(
  getRatingsForUser,
  R.then(createUserProfile),
  R.then(createUserInput)
);

module.exports = {createUserProfile, createUserInput, createUserInputFromId};
