const getUserRouter = require('express').Router();

// Mongoose Models
const userSchema = require('../../../../models/User');

getUserRouter.get('/:typeOfLogIn/:federalId', async (req, res) => {
  const query = {
    typeOfLogIn: req.params.typeOfLogIn,
    federalId: req.params.federalId
  }

  const response = await userSchema.findOne(query);
  response ? console.log(`${response.length} word(s) retrieved!`) : console.log("0 words retrieved!");

  res.send({
    status: response ? 'success' : 'empty',
    data: response
  });
})

module.exports = getUserRouter;

