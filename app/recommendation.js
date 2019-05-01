const R = require('ramda');
const brain = require('brain.js');
const {getAllRatings} = require('./models/rating');
const {getDistance} = require('./distance');
const {createUserProfile, createUserInputFromId} = require('./profile');


// Voir la doc de https://yarnpkg.com/en/package/brain.js#readme

let net;

const makeRestaurantByUser_ = R.map(
  // Il parcourt (applique) sur chacun des users
  R.map(
    // Il applique sur chacuns des ratings du user
    R.applySpec({
      priceLevel: R.path(['restaurant', 'priceLevel']), // On va chercher "priceLevel' et on le met dans priceLevel (le 1er)
      ratingGoogle: R.path(['restaurant', 'ratingGoogle']),
      rating: R.prop('rating') // Prop = path mais à la racine
    })
  )
);

const makenbInFiveByUser_ = R.map(
  R.pipe(
    R.pluck(1),
    R.filter(R.gte(0.05)),
    R.length,
    R.of
  )
);

const makeprofilesInput_ = R.map(
  R.pipe(
    R.slice(0, 3),
    R.pluck(0),
    R.unnest
  )
);

// CREATION DES X ET DES Y
const createDataset = async () => {
  const ratingListByUser = await R.pipe(
    getAllRatings,
    R.then(R.groupBy(R.path(['user', '_id'])))
  )();

  const restaurantsByUser = makeRestaurantByUser_(ratingListByUser);

  const profileList = R.map(createUserProfile, ratingListByUser);
  const allDistances = R.map(getDistance(R.values(profileList)), profileList); // ProfileList : on l'applique sur profileList
  const profilesInput = makeprofilesInput_(allDistances);
  const nbInFiveByUser = makenbInFiveByUser_(allDistances);

  const userSpecific = R.mergeWith(R.concat, profilesInput, nbInFiveByUser);

  return R.mapObjIndexed(
    (value, index) =>
      R.map(
        o => ({
          input: [...userSpecific[index], o.priceLevel, o.ratingGoogle],
          output: [o.rating * 0.2]
        }),
        value
      ),
    restaurantsByUser
  );
};

// RESEAU DE NEURONES
const initNN = async () => {
  const dataSet = await R.pipe(
    createDataset,
    R.then(R.values),
    R.then(R.unnest)
  )();

  // RESEAU DE NEURONES page 5

  const config = {
    binaryThresh: 0.5,
    hiddenLayers: [3], // Array of ints for the sizes of the hidden layers in the network
    activation: 'sigmoid', // Supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
    leakyReluAlpha: 0.01 // Supported for activation type 'leaky-relu'
  };

  // Create a simple feed forward neural network with backpropagation
  net = new brain.NeuralNetwork(config);
  console.log(dataSet);
  net.train(dataSet);
};

const recommandRestaurant = async (userId, listOfRestaurant) => {
    const userInput = await createUserInputFromId(userId);
    console.log(userInput);
    const y = R.map(
        restaurant => {console.log([...userInput,...restaurant]);
        console.log(net.run([ 2.4, 0.46, 1, 8.6, 0.5, 3.1, 0.55, 1, 8.4, 1.5, 2.4, 0.39, 1, 9, -4, 0, 4, 4 ]));
        return net.run([...userInput,...restaurant])}, listOfRestaurant);
  console.log(y);
};

initNN();

const retour = recommandRestaurant('5cc993b1d4078a4b672a935a', [
  [1, 2],
  [2, 3],
  [4, 4]
]);
