// Import and Declare the Router
const wordsRouter = require('express').Router();

// Import MongoDB related and its related declaratin
const mongoose = require('mongoose')
const yourDatabaseName = 'wordy-local'
const url = `mongodb://127.0.0.1:27017/${yourDatabaseName}`;

// Import Mongoose Models
const wordSchema = require('../../models/Word');

// Import required algorithm-helpers
const parsingEngine = require('../helper/parsingEngine');

// Here
wordsRouter.get('/', async (req, res) => {
  const data = await wordSchema.find()
  console.log(data);
  res.send('Umm data?: ' + data);
});

wordsRouter.post('/', (req, res) => {
  const parsedProperties = parsingEngine(req.body.parsetarget);
  saveIt(parsedProperties);

  // Save this as well! 
  const testWord = new wordSchema({
    word: 'This is the test',
    definition: 'Okay, the testing definition'
  })

  testWord.save()
  .then(document => console.log(document))
  .catch(err => console.log(err))
  
  const message = {
    state: 'success'
  }

  res.send(message);
});

// Saving data into MongoDB Engine
const saveIt = (parsedProperties) => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  const db = mongoose.connection;
  db.once('open', _ => {
    console.log('*****************');
    console.log(`MONGO DB CONNECTED // DATABASE NAME: ${yourDatabaseName}`)
    console.log('*****************')
  })

  db.on('error', err => {
    console.error('connection error:', err)
  })

  db.collection('words').insertMany(parsedProperties);
}

// Export the router
module.exports = wordsRouter;