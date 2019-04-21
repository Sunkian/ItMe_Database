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

app.get('/example', (req, res) => {
  console.log(req.query);
  res.send('ok');
});

app.get('/register', (req, res) => {
  createUser(req.query)
    .then(() => res.end('Ok'))
    .catch(() => res.end('Duplicate'));
});

app.get('/login', (req, res) => {
  logUser(req.query).then(doc => {
    if (doc) {
      res.end(JSON.stringify(doc.toObject()._id));
    } else {
      res.end('Ko');
    }
  });
});

app.get('/newRestaurant', (req, res) => {
  createRestaurant(req.query)
    .then(() => res.end('Ok'))
    .catch(() => res.end('Duplicate'));
});

app.get('/newRating', (req, res) => {
  createRating(req.query)
    .then(() => res.end('Ok'))
    .catch(() => res.end('Duplicate'));
});

app.get('/getTheRating', (req, res) => {
  getTheRating(req.query).then(doc => {
    if (doc) {
      res.end(JSON.stringify(doc.toObject()));
    } else {
      res.end('Ko');
    }
  });
});

app.listen(3000);
