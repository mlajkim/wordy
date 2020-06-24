// Import the basics
const express = require('express');

// Import MongoDB related and its related declaratin
const mongoose = require('mongoose')
const yourDatabaseName = 'wordy-local'
const url = `mongodb://127.0.0.1:27017/${yourDatabaseName}`;

// Initiate the basics
const mongoApiRouter = express.Router();

mongoApiRouter.use((req, res, next) => {
  // Actually required LOL.. (Connects to DB)
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
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