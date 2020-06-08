// Import the basics
const express = require('express');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./data.sqlite');

// Initiate the basics
const logRouter = express.Router();

// Get all logs
logRouter.get('/getAllLog/:userId/:reviewType', (req, res) => {
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
logRouter.get('/getLog/:userId/:reviewType', (req, res) => {
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
logRouter.get('/writeLog/:userId/:reviewType/:headWordId/:howMany', (req, res) => {
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

// Export the router
module.exports = logRouter;