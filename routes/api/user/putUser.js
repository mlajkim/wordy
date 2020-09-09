const putUserRouter = require('express').Router();

putUserRouter.put('/', (req, res) => {
  res.sendStatus(200);
})

module.exports = putUserRouter;