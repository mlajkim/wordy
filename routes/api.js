// Import the basics
const apiRouter = require('express').Router();

// Import routers
const mongoRouter = require('./api/mongo/mongo');
const paypalRouter = require('./api/paypal/paypal');

// Apply routers
apiRouter.use('/mongo', mongoRouter);
apiRouter.use('/paypal', paypalRouter);

// Export the router
module.exports = apiRouter;
