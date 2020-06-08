// Import the basics
const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data.sqlite');

// Initiate the basics
const wordRouter = express.Router();

// Basic returning api, now with SQL 
wordRouter.get('/getWords/:id', (req, res) => {
  const statement = db.prepare(`
    SELECT * FROM word
    WHERE id >= ?
    LIMIT ?
  `);

  statement.all([req.params.id, 5], (err, rows) => {
    if(err) {
      throw new Error(err);
    }
    res.json(rows);
  })
}); 

// This extracts all the data from the database
wordRouter.get('/getWords', (req, res) => {
  const statement = db.prepare(`
    SELECT * FROM word
  `);

  statement.all([], (err, rows) => {
    if(err) {
      throw new Error(err);
    }
    res.json(rows);
  })
});

// Export the router
module.exports = wordRouter;