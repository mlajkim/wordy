const v2 = require('express').Router();

// Import routers
const auth = require('./v2/auth');
const mongo = require('./v2/mongo');

// Apply routers
v2.use('/auth', auth);
v2.use('/mongo', mongo); 

module.exports = v2;
