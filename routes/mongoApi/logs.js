// Import and Declare the Router
const logsRouter = require('express').Router();

// Here
logsRouter.get('/', (req, res) => {
  res.send('Hello World!')
})

// Export the router
module.exports = logsRouter;