const getUserRouter = require('express').Router();

getUserRouter.get('/', (req, res) => {
  res.sendStatus(200);
})

module.exports = getUserRouter;