const getUserRouter = require('express').Router();

// Mongoose Models
const userSchema = require('../../../../models/User');

getUserRouter.get('/withID/:UNIQUE_ID', async (req, res) => {
  const UNIQUE_ID = req.params.UNIQUE_ID;
  const data = await userSchema.findById(UNIQUE_ID);
  res.send({data: data});
})

getUserRouter.get('/with-federalID/:typeOfLogIn/:federalId', async (req, res) => {
  // Find from the database
  const typeOfLogIn = req.params.typeOfLogIn;
  const federalId = req.params.federalId;
  const response = await userSchema.findOne({typeOfLogIn, federalId});

  res.send({
    status: response ? 'success' : 'empty',
    data: response
  });
})

module.exports = getUserRouter;

