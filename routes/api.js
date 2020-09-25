// Import the basics
const apiRouter = require('express').Router();

// Import routers
const mongoRouter = require('./api/mongo');
const paypalRouter = require('./api/paypal/paypal');
const v2 = require('./api/v2');

// Apply routers
apiRouter.use('/mongo', mongoRouter);
apiRouter.use('/paypal', paypalRouter);
apiRouter.use('/v2', v2);

// Export the router
module.exports = apiRouter;
