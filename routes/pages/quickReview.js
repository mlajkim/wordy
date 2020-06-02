// Import the basics
const express = require('express');

// Initiate the basics
const quickReviewRouter = express.Router();

quickReviewRouter.get('', (req, res) => {
  const message = {message: 'this is quickReviewRouter'}
  res.json(message);
}); 

// Export the router
module.exports = quickReviewRouter;