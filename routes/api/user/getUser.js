const getUserRouter = require('express').Router();

// Mongoose Models
const userSchema = require('../../../models/User');

getUserRouter.get('/:typeOfLogIn/:federalId', async (req, res) => {
  const query = {
    typeOfLogIn: req.params.typeOfLogIn,
    federalId: req.params.federalId
  }

  const response = await userSchema.find(query).limit(1);
  res.send(response);

})

module.exports = getUserRouter;

