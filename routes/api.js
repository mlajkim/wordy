// Import the basics
const express = require('express');

// Initiate the basics
const apiRouter = express.Router();

// Import routers
const logRouter = require('./v1/log');
const wordRouter = require('./v1/word');
const signInRouter = require('./api/signIn');

// Apply routers 
apiRouter.use('', logRouter);
apiRouter.use('', wordRouter);
apiRouter.use('/signIn', signInRouter);

// Export the router
module.exports = apiRouter;