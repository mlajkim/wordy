// Import the basics
const apiRouter = require('express').Router();
const {mongoDbUrl} = require('../credential');
const mongoose = require('mongoose');

apiRouter.use((req, res, next) => {
  // Actually required LOL.. (Connects to DB)
  // This allows everything under mongoApi Routers connected to the route.
  mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  next();
})

// Import routers
const userRouter = require('./api/user/user');
const wordRouter = require('./api/word/word');
const paypalRouter = require('./api/paypal/paypal');

// Apply routers
apiRouter.use('/user', userRouter);
apiRouter.use('/word', wordRouter);
apiRouter.use('/paypal', paypalRouter);

// Export the router
module.exports = apiRouter;
