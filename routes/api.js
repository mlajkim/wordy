// Import the basics
const express = require('express');

// Initiate the basics
const apiRouter = express.Router();

// Import routers
const signInRouter = require('./api/signIn');

// Apply routers
apiRouter.use('/signIn', signInRouter);

// Export the router
module.exports = apiRouter;