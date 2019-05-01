const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan'); // Affichage des evenement (gets et posts dans le terminal)
const {createUser, logUser} = require('./app/models/user');
const {createRestaurant} = require('./app/models/restaurant');
const {createRating, getTheRating} = require('./app/models/rating');
const {recommendRestaurant, initNN} = require('./app/recommendation');

app.use(morgan('tiny')); // Comment on veut afficher nos logs

app.use(bodyParser.urlencoded({extended: false}));

// Parse application/json
app.use(bodyParser.json());

app.get('/register', (req, res) => {
  // Get : create a new ressource, req : request, res : response, font partie de la norme http
  createUser(req.query) // Notre requete dans le terminal : GET /register?email=a&password=a&age=1&gender=a 200 - - 17.238 ms, ca donne email, password et le reste sous la forme d'un objet
    // Le Query c'est : {email: 'a', password: 'a'}
    .then(() => res.end(JSON.stringify('Ok'))) // Res.end renvoie la réponse, JSON.stringify change nos valeurs en strings
    .catch(() => res.end(JSON.stringify('Duplicate')));
});

app.get('/login', (req, res) => {
  logUser(req.query).then(doc => {
    // On essaie de se loguer en fct d'un log et d'un mdp. On cherche si ya un user qui a des log qui sont ont été inscrits
    if (doc) {
      res.end(JSON.stringify(doc.toObject()._id)); // Si oui, la personne est déjà dans la bdd donc c'est bon elle peut se connecter
    } else {
      res.end(JSON.stringify('Ko')); // Sinon, il peut pas se connecter
    }
  });
});

app.get('/newRestaurant', (req, res) => {
  createRestaurant(req.query).then(id => {
    res.end(JSON.stringify(id));
  });
});

app.get('/newRating', (req, res) => {
  createRating(req.query)
    .then(() => {
      res.end(JSON.stringify('Ok'));
      initNN();
    })
    .catch(() => res.end(JSON.stringify('Duplicate')));
});

app.get('/getTheRating', (req, res) => {
  getTheRating(req.query).then(doc => {
    if (doc) {
      res.end(JSON.stringify(doc.toObject().rating));
    } else {
      res.end(JSON.stringify('Ko'));
    }
  });
});

app.post ('/recommendation', async (req, res) => {
  console.log(req.body);
  res.end(JSON.stringify(await recommendRestaurant(req.body)));

});

app.listen(3000);
