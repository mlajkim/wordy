// Import the basics
const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data.sqlite');

// Initiate the basics
const apiRouter = express.Router();

// Basic returning api, now with SQL 
apiRouter.get('/getWords', (req, res) => {
  const statement = db.prepare(`
    SELECT * FROM word
    WHERE id >= ?
    LIMIT ?
  `);

  statement.all([274, 5], (err, rows) => {
    if(err) {
      throw new Error(err);
    }
    res.json(rows);
  })
}); 

// Export the router
module.exports = apiRouter;