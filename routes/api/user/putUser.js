const putUserRouter = require('express').Router();

const userSchema = require('../../../models/User');

putUserRouter.put('/:uniqueId/one/:type', async (req, res) => {
  const UNIQUE_ID = req.params.uniqueId;
  const update = {[req.params.type]: req.body.value}
  const option = {useFindAndModify: false}
  
  let response = await userSchema.findByIdAndUpdate(UNIQUE_ID, update, option);
  res.send(response);
})

putUserRouter.put('/:uniqueId/all/', (req, res) => {

})

module.exports = putUserRouter;