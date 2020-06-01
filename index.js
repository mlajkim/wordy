// Implement the basics
const express = require('express');
const path = require('path');

// Initiate App
const app = express();
const PORT = process.env.PORT || 5000;

// Connecting to Wordy
app.use(express.static(path.join(__dirname, './client/build')));

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
app.get('/api/getWords', (req, res) => {
  const words = [word, word, word, word, word];
  res.json(words);
});

// Begin the express server
app.listen(PORT, () => {
  console.log(`Express server running on the port: ${PORT}`)
});
