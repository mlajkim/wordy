// Import the basics
const express = require('express');

// Initiate the basics
const mongoApiRouter = express.Router();

// Import routers
const wordsRouter = require('./mongoApi/words');
const logsRouter = require('./mongoApi/logs');
const usersRouter = require('./mongoApi/logs');

// Apply routers 
mongoApiRouter.use('/words', wordsRouter);
mongoApiRouter.use('/logs', logsRouter);
mongoApiRouter.use('/users', usersRouter);

// Export the router
module.exports = mongoApiRouter;