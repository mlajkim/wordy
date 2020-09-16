const getWordRouter = require('express').Router();

const wordSchema = require('../../../../models/Word');

getWordRouter.get('/:ownerId', async (req, res) => {
  const query = {
    owner: req.params.ownerId
  }

  const data = await wordSchema.find(query)
  res.send({
    status: data !== undefined ? 'success' : 'empty',
    data: data
  })

});

module.exports = getWordRouter;