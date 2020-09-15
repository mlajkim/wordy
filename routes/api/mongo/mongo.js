const mongoRouter = require('express').Router();

const {mongoDbUrl} = require('../../../credential');
const mongoose = require('mongoose');

mongoRouter.use((req, res, next) => {
  // Actually required LOL.. (Connects to DB)
  // This allows everything under mongoApi Routers connected to the route.
  mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  next();
})

// import
const userRouter = require('./user/user');
const wordRouter = require('./word/word');

// use
mongoRouter.use('/user', userRouter);
mongoRouter.use('/word', wordRouter);

module.exports = mongoRouter;