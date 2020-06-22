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
    if(language){ // Run parsing engine only when it is NOT empty.
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
    } // if(language) ends 
  })
  
  // Check if semester exists, if not, add!
  semesterSchema.find()
  .then(semesters => {

    // if this becomes true, it means the same thing is found.
    // Also means, it does not have to create new one.
    let found = false; 

    semesters.forEach(semester => {
      // Loop through the semester data
      if(semester.year == yearCalculated && semester.semester == semCalculated){
        found = true;
      }
    })

    if(!found){ // run only when it is not found.
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

wordsRouter.get('/', async (req, res) => {
  const data = await wordSchema.find()
  res.send(data);
}); //5ee7437a908c1c3c080c4043

wordsRouter.put('/', async (req, res) => {
  const wordData = req.body;

  // Algorithm
  const query = {_id: wordData.wordId}
  await wordSchema.updateOne(query, {
    word: wordData.word,
    pronunciation: wordData.pronunciation,
    definition: wordData.definition,
    exampleSentence: wordData.exampleSentence,
    isPublic: wordData.isPublic
  })

  // Temporary sending status
  res.status(201).send({message: "success"});
});

wordsRouter.get('/semesterized', async (req, res) => {
  // Get the data first
  const semesterData = await semesterSchema.find();
  const wordsDataChunk = await wordSchema.find();

  // Algorithm will fill the following
  const wordsDataArr = [];

  semesterData.forEach(data => {
    const foundYear = data.year;
    const foundSem = data.semester;

    // Iterate through the words Data
    wordsDataArr.push(wordsDataChunk.filter(word => {
      if(word.year === foundYear && word.semester === foundSem){
        //if it matches,
        return true;
      }else{
        //if it does not match
        return false;
      }
    }))// wordsDataArr.push ends

  })

  res.send(wordsDataArr);
});

wordsRouter.get('/searchId/:wordId', async (req, res) => {
  const data = await wordSchema.findOne({_id: req.params.wordId})
  res.send(data);
});

// Export the router
module.exports = wordsRouter;