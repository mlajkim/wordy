// Import the basics
const express = require('express');

// Initiate the basics
const mongoApiRouter = express.Router();

// Import routers
const wordsRouter = require('./mongoApi/words');
const logsRouter = require('./mongoApi/logs');
const usersRouter = require('./mongoApi/logs');

// Apply routers 
apiRouter.use('/words', wordsRouter);
apiRouter.use('/logs', logsRouter);
apiRouter.use('/users', usersRouter);

// Export the router
module.exports = mongoApiRouter;