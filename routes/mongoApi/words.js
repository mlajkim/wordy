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

wordsRouter.use((req, res, next) => {
  // Actually required LOL.. (Connects to DB)
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }) 
  next();
})

// Here
wordsRouter.get('/', async (req, res) => {
  const data = await wordSchema.find()
  console.log(data);
  res.send('Umm data?: ' + data);
});

wordsRouter.post('/', (req, res) => {
  // The responding message
  const message = {
    state: 'success'
  }

  // The Parsed Properties.
  const parsedProperties = parsingEngine(req.body.parsetarget);

  // Loop through
  parsedProperties.forEach(parsedProperty => {
    const tempWordSchema = new wordSchema({
      dateAdded: parsedProperty.dateAdded,
      word: parsedProperty.word,
      definition: parsedProperty.definition,
      pronunciation: parsedProperty.pronunciation,
      definition: parsedProperty.definition,
      exampleSentence: parsedProperty.exampleSentence
    })

    tempWordSchema.save()
    .then(document => console.log(document))
    .catch(err => console.log(err))
  }) // parsedProperties loop ends 
  
  
  res.send(message);
});

// Export the router
module.exports = wordsRouter;