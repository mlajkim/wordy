// Import the basics
const express = require('express');
const path = require('path');

// Google Sign in 
const google = require('googleapis').google;
const jwt = require('jsonwebtoken');
const CONFIG = require('./config');

// Initiate the express app and Export it
const app = express();
const PORT = process.env.PORT || 8080;

// Connecting to Wordy
app.use(express.static(path.join(__dirname, './client/build')));

// Import the developing tools
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Connecting the development tools
app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Setting the Oauth 2 (Setting up EJS Views)
app.set('view engine', 'ejs');
app.set('views', __dirname);
 
// Bring the routers into the app
const apiRouter = require('./routes/api');
const mongoApiRouter = require('./routes/mongoApi');

// Put the remote routers available for app
app.use('/api', apiRouter);
app.use('/mongoApi', mongoApiRouter);

// Begin the express server
app.listen(PORT, () => {
  console.log(`Express server running on the port: ${PORT}`)
});
