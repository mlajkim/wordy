// Import and Declare the Router
const wordsRouter = require('express').Router();

// Import MongoDB related and its related declaratin
const mongoose = require('mongoose')
const yourDatabaseName = 'wordy-local'
const url = `mongodb://127.0.0.1:27017/${yourDatabaseName}`;

// Import Mongoose Models
const wordSchema = require('../../models/Word');
const semesterSchema = require('../../models/Semester');

// Import required algorithm-helpers
const parsingEngine = require('../helper/parsingEngine');

wordsRouter.use((req, res, next) => {
  // Actually required LOL.. (Connects to DB)
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }) 
  next();
})

// GET
wordsRouter.get('/', async (req, res) => {
  const data = await wordSchema.find()
  res.send(data);
});

wordsRouter.get('/semesterized', async (req, res) => {

});

wordsRouter.post('/', (req, res) => {
  // Hard coded language order
  const languageOrder = ['Korean', 'English', 'Chinese', 'Japanese'];

  // Check if year or semester is given, else, will be today's date!
  // The non-selected will be 'default'
  const currentTime = new Date();
  const yearCalculated = req.body.userPreference.year === 'default' ? currentTime.getFullYear() : req.body.userPreference.year
  const semCalculated = req.body.userPreference.semester === 'default' ? Math.floor(currentTime.getMonth() / 3) + 1 : req.body.userPreference.semester


  // Loop through the languages
  req.body.parsetarget.forEach((language, index) => {
    const parsedProperties = parsingEngine(language);

    // Loop through
    parsedProperties.forEach(parsedProperty => {
      const tempWordSchema = new wordSchema({
        owner: req.body.userPreference.owner,
        dateAdded: currentTime,
        year: yearCalculated,
        semester: semCalculated,  
        language: languageOrder[index],
        word: parsedProperty.word,
        definition: parsedProperty.definition,
        pronunciation: parsedProperty.pronunciation,
        definition: parsedProperty.definition,
        exampleSentence: parsedProperty.exampleSentence,
        isPublic: req.body.userPreference.isPublic
      })

      tempWordSchema.save()
        .catch(err => console.log(err))
    }) // parsedProperties loop ends 
  })
  
  // Check if semester exists, if not, add!
  semesterSchema.find()
  .then(result => {
    let found = false;
    console.log(result);
    result.forEach(element => {
      // Loop through the semester data
      if(element.year === yearCalculated && element.semester === semCalculated){
        found = true;
      }
    })
    console.log(found);
    if(!found){
      //if not found, it means it is the new semester!
    const newSemesterSchema = new semesterSchema({
      owner: req.body.userPreference.owner,
      year: yearCalculated,
      semester: semCalculated
    })
    
    newSemesterSchema.save()
      .then(document => console.log(document))
      .catch(err => console.log(err))
    }
    
  }) // End of POST word

  // Send back the message 'success'
  res.send({state: 'success'});
});



// Export the router
module.exports = wordsRouter;