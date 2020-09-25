const mongo = require('express').Router();
const {mongoDbUrl} = require('../../../credential');
const mongoose = require('mongoose');

mongo.use((req, res, next) => {
  // Actually required LOL.. (Connects to DB)
  // This allows everything under mongoApi Routers connected to the route.
  mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })

  console.log("\nV2*******************************************************");
  console.log(`${new Date().toString()}`);

  next();
})

// Import routers
const users = require('./mongo/users');
const words = require('./mongo/words');
const transactions = require('./mongo/transactions');

// Apply routers
mongo.use('/users', users);
mongo.use('/words', words);
mongo.use('/transactions', transactions);

module.exports = mongo;
