const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// dotenv
require('dotenv').config({ path: './utils/.env' });

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const user = process.env.DB_USER;
const pwd = process.env.DB_PWD;
const host = process.env.DB_HOST;

// MongoDB connection
mongoose
  .connect(`mongodb+srv://${user}:${pwd}@${host}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection to MongoDB successfully worked !'))
  .catch(() => console.log('Connection to MongoDB failed !'));

//create express app
const app = express();

// set headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
