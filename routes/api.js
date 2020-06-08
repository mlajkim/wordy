// Import the basics
const express = require('express');

// Initiate the basics
const apiRouter = express.Router();

// Import routers
const logRouter = require('./v1/log');
const wordRouter = require('./v1/word');

// Apply routers 
apiRouter.use('', logRouter);
apiRouter.use('', wordRouter);

// Export the router
module.exports = apiRouter;