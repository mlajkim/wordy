// Import and Declare the Router
const wordsRouter = require('express').Router();

// Import Mongoose Models
const wordSchema = require('../../models/Word');
const semesterSchema = require('../../models/Semester');

// import routers
const wordsPostRouter = require('./words/post');

// Use the routers
wordsRouter.use('/post', wordsPostRouter);
// #1

// inSemester
wordsRouter.get('/', async (req, res) => {
  const data = await wordSchema.find()
  res.send(data);
}); //5ee7437a908c1c3c080c4043

wordsRouter.get('/inSemester/:year/:semester/:userId', async (req, res) => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

  const query = {
    year: req.params.year,
    semester: req.params.semester,
    owner: req.params.userId,
  }
  const data = await wordSchema.find(query)
  res.send(data);
}); //5ee7437a908c1c3c080c4043

// #2
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

// #3
wordsRouter.delete('/', async (req, res) => {
  const wordId = req.body.wordId;
  await wordSchema.deleteOne({_id: wordId})
  res.sendStatus(204);
}); //5ee7437a908c1c3c080c4043

wordsRouter.get('/parsedToday', async (req, res) => {
  const today = new Date(Date.now())
  const dateToday = today.getDate(); // Will be one btwn 1~31
  const monthToday = today.getMonth(); // Will be one btwn 1~12
  const yearToday = today.getYear(); // Year of 2012 = 112***

  // Just find all the data from word list
  const data = await wordSchema.find();

  // Declare an array of words that has been parsed today.
  const arrayOfDataSending = [];

  // Compare each data, then push if it fits.
  data.forEach(word => {
    const parsedDateOftheWord = new Date(word.dateAdded);
    if(
      dateToday === parsedDateOftheWord.getDate() && 
      monthToday === parsedDateOftheWord.getMonth() &&
      yearToday === parsedDateOftheWord.getYear()  
      )
      {
        arrayOfDataSending.push(word);
      }
  })

  res.send(arrayOfDataSending);
}); //5ee7437a908c1c3c080c4043

// #4
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