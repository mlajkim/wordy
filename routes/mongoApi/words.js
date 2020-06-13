// Import and Declare the Router
const wordsRouter = require('express').Router();

// Here
wordsRouter.get('/', (req, res) => {
  res.send('Hello words!')
})

wordsRouter.post('/', (req, res) => {
  console.log(req.body);
  
  const message = {
    state: 'success',
    contents: req.body.parsetarget
  }

  res.send(message);
})

// Export the router
module.exports = wordsRouter;