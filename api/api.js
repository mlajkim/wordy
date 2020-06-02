// Import the basics
const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data.sqlite');

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

// Read specific data from database
// Returns an array of words
const readData = (id, many) => {
  const statement = db.prepare(`
    SELECT * FROM word
    WHERE id >= ?
    LIMIT ?
  `);

  statement.all([id, many], (err, rows) => {
    if(err) {
      console.log(err);
    }else{
      console.log(rows);
      return rows;
    }
  })
}

// Basic returning api
apiRouter.get('/getWords', (req, res) => {
  const words = readData(269, 5);
  res.json(words);
}); 

// Export the router
module.exports = apiRouter;