const app = require('express')();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {createUser, logUser} = require('./app/models/user');
const {createRestaurant} = require('./app/models/restaurant');
const {createRating, getTheRating} = require('./app/models/rating');

app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({extended: false}));

// Parse application/json
app.use(bodyParser.json());

app.post('/register', (req, res) => {
  createUser(req.body)
    .then(() => res.end('Ok'))
    .catch(() => res.end('Duplicate'));
});

app.post('/login', (req, res) => {
  logUser(req.body).then(doc => {
    if (doc) {
      res.end(JSON.stringify(doc.toObject()._id));
    } else {
      res.end('Ko');
    }
  });
});

app.post('/newRestaurant', (req, res) => {
  createRestaurant(req.body)
    .then(() => res.end('Ok'))
    .catch(() => res.end('Duplicate'));
});

app.post('/newRating', (req, res) => {
  createRating(req.body)
    .then(() => res.end('Ok'))
    .catch(() => res.end('Duplicate'));
});

app.post('/getTheRating', (req, res) => {
  getTheRating(req.body).then(doc => {
    if (doc) {
      res.end(JSON.stringify(doc.toObject()));
    } else {
      res.end('Ko');
    }
  });
});

app.listen(3000);
