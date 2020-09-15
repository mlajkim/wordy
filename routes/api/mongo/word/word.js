// Import the basics
const wordRouter = require('express').Router();
const getWordRouter = require('./getWord');

wordRouter.use('', getWordRouter);

module.exports = wordRouter;
