// Import and Declare the Router
const logsRouter = require('express').Router();

// Import MongoDB related and its related declaratin
const mongoose = require('mongoose')
const yourDatabaseName = 'wordy-local'
const url = `mongodb://127.0.0.1:27017/${yourDatabaseName}`;

// Import Mongoose Models
const logSchema = require('../../models/Log');

// Connects to DB
logsRouter.use((req, res, next) => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }) 
  next();
})

// GET the LAST LOG
logsRouter.get('/lastLog', async (req, res) => {
  const data = await logSchema.findOne().sort({$natural:-1})

  res.send(data);
})

// GET
logsRouter.get('/', async (req, res) => {
  const data = await logSchema.find()
  res.send(data);
})

// POST
logsRouter.post('/', (req, res) => {
  const tempLogSchema = new logSchema({
    userId: req.body.userId,
    type: req.body.type,
    dateReviewed: req.body.dateReviewed,
    wordId: req.body.wordId
  })

  tempLogSchema.save()
    .then(document => console.log(document))
    .catch(err => console.log(err))

  res.send({state: 'success'});
})

// Export the router
module.exports = logsRouter;