const putUserRouter = require('express').Router();

putUserRouter.put('/lastUsed/:uniqueId', (req, res) => {
  res.sendStatus(200);
})

module.exports = putUserRouter;