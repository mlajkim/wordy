const deleteUserRouter = require('express').Router();

deleteUserRouter.delete('/', (req, res) => {
  res.sendStatus(200);
})

module.exports = deleteUserRouter;