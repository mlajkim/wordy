const v2 = require('express').Router();

// Import routers
const mongo = require('./v2/mongo');
// Apply routers
mongo.use('/mongo', mongo);

module.exports = v2;
