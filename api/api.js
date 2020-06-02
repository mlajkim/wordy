// Import the basics
const express = require('express');

// Initiate the basics
const apiRouter = express.Router();

//Hard coded word
const word = {
  owner_id: 1,
  date_created: 1590297520459, // May 24, 2020 (Sun)
  year: 2020,
  semester: 2,
  category_id: 2,
  word: 'revenous',
  pronunciation: 'reh-vuh-nus',
  definition: 'extremely hungry',
  example_sentence: 'I am revenous, where is my supper?'
};

// Basic returning api
apiRouter.get('/getWords', (req, res) => {
  const words = [word, word, word, word, word];
  res.json(words);
}); 

// Export the router
module.exports = apiRouter;