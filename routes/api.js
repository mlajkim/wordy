// Import the basics
const apiRouter = require('express').Router();

// Import routers
const mongoRouter = require('./api/mongo/mongo');

// Apply routers
apiRouter.use('/mongo', mongoRouter);

// Export the router
module.exports = apiRouter;
