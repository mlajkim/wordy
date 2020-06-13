// Import and Declare the Router
const usersRouter = require('express').Router();

// Here
usersRouter.get('/', (req, res) => {
  res.send('Hello World!')
})

// Export the router
module.exports = usersRouter;