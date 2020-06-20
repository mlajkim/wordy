// Import the basics
const express = require('express');

// Initiate the basics
const signInRouter = express.Router();

signInRouter.get('/', (req, res) => {
  res.send('Hello SignInRouter!')
})

// Export the router
module.exports = signInRouter;