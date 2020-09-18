const deleteUserRouter = require('express').Router();
const userSchema = require('../../../../models/User');

deleteUserRouter.delete('/delete', async (req, res) => {
  const UNIQUE_ID = req.body.UNIQUE_ID;

  let response = await userSchema.findByIdAndDelete(UNIQUE_ID);
  res.send(response);
})

module.exports = deleteUserRouter;