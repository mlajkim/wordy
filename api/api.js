// Import the basics
const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data.sqlite');

// Initiate the basics
const apiRouter = express.Router();

// Get all logs
apiRouter.get('/getAllLog/:userId/:reviewType', (req, res) => {
  const statement = db.prepare(`
  SELECT * FROM log
  WHERE user_id = ?
  AND review_type = ?
  ORDER BY word_id DESC, date_reviewed DESC
`);

statement.all([req.params.userId, req.params.reviewType], (err, row) => {
  if(err) {
    throw new Error(err);
  }
  res.json(row);
})
})

// This api reads the last log of the user
apiRouter.get('/getLog/:userId/:reviewType', (req, res) => {
  const statement = db.prepare(`
    SELECT * FROM log
    WHERE user_id = ?
    AND review_type = ?
    ORDER BY word_id DESC, date_reviewed DESC
    LIMIT 1
  `);

  statement.get([req.params.userId, req.params.reviewType], (err, row) => {
    if(err) {
      throw new Error(err);
    }
    res.json(row);
  })
});

// This api writes log
apiRouter.get('/writeLog/:userId/:reviewType/:headWordId/:howMany', (req, res) => {
  db.serialize(() => {
    // Loop through according to how many times it should run
    for(let i = 0 ; i < req.params.howMany ; i++){
      const statement = db.prepare(`
        INSERT INTO log (user_id, date_reviewed, review_type, word_id)
        VALUES (?, ?, ?, ?) 
      `);

      const insertingDataArr = [
        req.params.userId, 
        Date.now(),
        req.params.reviewType, 
        (Number(req.params.headWordId) + i)
      ];

      statement.run(insertingDataArr, (err) => {
        if(err) {
          throw new Error(err);
        }
      })

    }

    const message = "Successful!"
    res.json({message: message});
  })
})

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