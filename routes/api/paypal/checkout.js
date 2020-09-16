const checkoutRouter = require('express').Router();

checkoutRouter.post('/save/transaction', (req, res) => {
  console.log(req.body);
  res.sendStatus(200);
})

module.exports = checkoutRouter;