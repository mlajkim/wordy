const putUserRouter = require('express').Router();

const userSchema = require('../../../models/User');

putUserRouter.put('/:uniqueId/one/:type', async (req, res) => {
  const UNIQUE_ID = req.params.uniqueId;
  const target = req.params.type;

  console.log(target);
  console.log(req.body.value)
  
  let response = await userSchema.findByIdAndUpdate(UNIQUE_ID, {[target]: req.body.value})
  res.send(response);
})

putUserRouter.put('/:uniqueId/all/', (req, res) => {

})

module.exports = putUserRouter;