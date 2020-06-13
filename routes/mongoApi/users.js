// Import and Declare the Router
const usersRouter = require('express').Router();

// Import MongoDB related and its related declaratin
const mongoose = require('mongoose')
const yourDatabaseName = 'wordy-local'
const url = `mongodb://127.0.0.1:27017/${yourDatabaseName}`;

// Connects to DB
usersRouter.use((req, res, next) => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }) 
  next();
})

// GET
usersRouter.get('/', (req, res) => {
  res.send('Hello World!')
})

// Export the router
module.exports = usersRouter;