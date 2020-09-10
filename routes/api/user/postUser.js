const postUserRouter = require('express').Router();

const userSchema = require('../../../models/User');

postUserRouter.post('/', async (req, res) => {
  const profile = req.body;

  const newUser = new userSchema({
    typeOfLogIn: profile.typeOfLogIn,
    federalId: profile.federalId, // Google's googleId;
    email: profile.email,
    familyName: profile.familyName,
    givenName: profile.givenName,
    profileImgUrl: profile.profileImgUrl,
    readPatch: profile.readPatch,
    subscription: profile.subscription,
    joinedDate: Date.now()
  })

  const response = await newUser.save();
  console.log(`
  ***NEW USER ADDED***
  Name: ${profile.givenName} ${profile.familyName}
  Email address: ${profile.email}
  `)
  res.send(response);

});

module.exports = postUserRouter;