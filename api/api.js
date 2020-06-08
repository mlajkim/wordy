// Import the basics
const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data.sqlite');

// Initiate the basics
const apiRouter = express.Router();

// This api reads the last log of the user
apiRouter.get('/getLog/:userId/:reviewType', (req, res) => {
  const statement = db.prepare(`
    SELECT * FROM log
    WHERE user_id = ?
    AND review_type = ?
    ORDER BY date_reviewed DESC
    LIMIT 1
  `);

  statement.get([req.params.userId, req.params.reviewType], (err, row) => {
    if(err) {
      throw new Error(err);
    }
    res.json(row);
  })
});

// Basic returning api, now with SQL 
apiRouter.get('/getWords/:id', (req, res) => {
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
apiRouter.get('/getWords', (req, res) => {
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
module.exports = apiRouter;