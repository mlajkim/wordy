const getWordRouter = require('express').Router();

const wordSchema = require('../../../models/Word');

getWordRouter.get('/:ownerId', async (req, res) => {
  const query = {
    owner: req.params.ownerId
  }

  const data = await wordSchema.find(query)
  console.log(data);
  if(data === null) res.sendStatus(204);
  res.send(data);
}); //5ee4ccfa4b391e1e931c4b64

module.exports = getWordRouter;