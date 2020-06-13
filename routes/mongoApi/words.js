// Import and Declare the Router
const wordsRouter = require('express').Router();

// Here
wordsRouter.get('/', (req, res) => {
  res.send('Hello World!')
})

// Export the router
module.exports = wordsRouter;