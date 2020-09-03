// Import the basics
const express = require('express');
const {mongoDbUrl} = require('../credential');

// Import MongoDB related and its related declaratin
const mongoose = require('mongoose');

// Initiate the basics
const mongoApiRouter = express.Router();

mongoApiRouter.use((req, res, next) => {
  // Actually required LOL.. (Connects to DB)
  // This allows everything under mongoApi Routers connected to the route.
  mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  next();
})

// Import routers
const wordsRouter = require('./mongoApi/words');
const logsRouter = require('./mongoApi/logs');
const usersRouter = require('./mongoApi/logs');
const semestersRouter = require('./mongoApi/semesters');

// Apply routers 
mongoApiRouter.use('/words', wordsRouter);
mongoApiRouter.use('/logs', logsRouter);
mongoApiRouter.use('/users', usersRouter);
mongoApiRouter.use('/semesters', semestersRouter);

// Export the router
module.exports = mongoApiRouter;