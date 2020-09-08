const googleSigninRouter = require('express').Router();

// Google Sign in 
const google = require('googleapis').google;
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const CONFIG = require('../../../config');

googleSigninRouter.get('/googleSignin', (req, res) => {
  const oauth2Client = new OAuth2(CONFIG.oauth2Credentials.client_id, 
                                  CONFIG.oauth2Credentials.client_secret, 
                                  CONFIG.oauth2Credentials.redirect_uris[0]);
                        
  const loginLink = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Indicates that we need to be able to access data continously without the user constantly giving us consent
    scope: CONFIG.oauth2Credentials.scopes // Using the access scopes from our config file
  });

  return res.render("index", { loginLink: loginLink });
});

module.exports = googleSigninRouter;