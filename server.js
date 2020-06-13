// Import the basics
const express = require('express');
const path = require('path');

// Import the developing tools
const morgan = require('morgan');

// Initiate the express app and Export it
const app = express();
const PORT = process.env.PORT || 8080;

// Connecting to Wordy
app.use(express.static(path.join(__dirname, './client/build')));

// Connecting the development tools
app.use(morgan('dev'));

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
