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
const wordRouter = require('./api/word/word')
const signInRouter = require('./api/signIn');
const googleSigninRouter = require('./api/authentication/googleSignin');

// Apply routers
apiRouter.use('/word', wordRouter);
apiRouter.use('/signIn', signInRouter);
// you may expand later to Apple, or other stuff
apiRouter.use('/authentication', googleSigninRouter); 

// Export the router
module.exports = apiRouter;
