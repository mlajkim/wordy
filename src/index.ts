import express from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
// Credential
import {COMODO_SSL_KEY_PASSWORD} from './credential';
// Routers
import api from './routes/api';

const app = express();
const PORT = process.env.PORT || 80;
const PORTHTTPS = process.env.PORT || 443;

// Connecting to Wordy
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api', api); // only router

// https certificates import
const option = {
  ca: fs.readFileSync('./certificates/ca-bundle.crt'), // Certificate BUNDLES
  cert: fs.readFileSync('./certificates/wordy-cloud_com.crt'), // correct
  key: fs.readFileSync('./certificates/comodo-ssl-ca.key'), // mostliekly correct  
  passphrase: COMODO_SSL_KEY_PASSWORD, // password for the key
};

// Write the time today
console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
console.log("*********************************************************");
console.log(`${new Date().toString()}`);
console.log("*********************************************************");
console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

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