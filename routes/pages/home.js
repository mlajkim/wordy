// Import the basics
const express = require('express');

// Initiate the basics
const homeRouter = express.Router();

// Basic
// Basic returning api
homeRouter.get('', (req, res) => {
  const message = {message: 'this is homeRouter'}
  res.json(message);
}); 

// Export the router
module.exports = homeRouter;