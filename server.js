// Import the basics
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');

// import security
const {COMODO_SSL_KEY_PASSWORD} = require('./credential');

// Initiate the express app and Export it
const app = express();
const PORT = process.env.PORT || 80;
const PORTHTTPS = process.env.PORT || 443;

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

// https option
const option = {
  ca: fs.readFileSync('./certificates/ca-bundle.crt'), // Certificate BUNDLES
  cert: fs.readFileSync('./certificates/wordy-cloud_com.crt'), // correct
  key: fs.readFileSync('./certificates/comodo-ssl-ca.key'), // mostliekly correct  
  passphrase: COMODO_SSL_KEY_PASSWORD, // password for the key
};

const runningType = process.argv[2] ? 'dev' : '';
if(runningType === 'dev') {
  app.listen(PORT, () => {
    console.log(`DEVELOPMENT NON-SECURED SERVER running at PORT ${PORT}`);
  })
} else {
  // Begin the express server
  https.createServer(option, app).listen(PORTHTTPS, () => {
    console.log(`ACTUAL SERVER running at PORT ${PORTHTTPS} (HTTPS)`);
  })
}



