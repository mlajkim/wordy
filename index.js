// Import the basics
const express = require('express');
const path = require('path');

// Initiate the express app and Export it
const app = express();
const PORT = process.env.PORT || 5000;

// Connecting to Wordy
app.use(express.static(path.join(__dirname, './client/build')));

// Bring the routers into the app
const apiRouter = require('./routes/api/api');

// Put the remote routers available for app
app.use('/api', apiRouter);

// Begin the express server
app.listen(PORT, () => {
  console.log(`Express server running on the port: ${PORT}`)
});
