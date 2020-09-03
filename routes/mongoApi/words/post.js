// Import and Declare the Router
const wordsPostRouter = require('express').Router();

// Import Mongoose Models
const wordSchema = require('../../../models/Word');
const semesterSchema = require('../../../models/Semester');

// Import required algorithm-helpers
const parsingEngine = require('../../helper/parsingEngine');

wordsPostRouter.post('/', (req, res) => {
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

module.exports = wordsPostRouter;