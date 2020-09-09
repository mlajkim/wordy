const postUser = require('express').Router();

postUser.post('/', (req, res) => {
  res.sendStatus(200);
})

module.exports = postUser;