import express, { Request, Response } from 'express';
import fs from 'fs';
import https from 'https';
import path from 'path';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { graphqlHTTP } from 'express-graphql';
import schema from './routes/graphql';
// Routers
import api from './routes/api';
import apigateway from './routes/apigateway';

const app = express();
const PORT = process.env.PORT || 80;
const PORTHTTPS = process.env.PORT || 443;
dotenv.config();

// Connecting to Wordy
app.use(express.static(path.join(__dirname, '../client/build')));

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', api); //REST API
app.use('/apigateway', apigateway); //REST API
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));  //GraphQL
app.get('*', (_req: Request, res: Response) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../client/build/') });
});

// 2020-2021 OPTION
/*
const option = {
  ca: fs.readFileSync('./certificates/ca-bundle.crt'), // Certificate BUNDLES
  cert: fs.readFileSync('./certificates/wordy-cloud_com.crt'), // correct
  key: fs.readFileSync('./certificates/comodo-ssl-ca.key'), // mostliekly correct  
  passphrase: process.env.COMODO_SSL_KEY_PASSWORD_2020, // password for the key
};
*/

// Certificate Path === CP
const CP = './certificates/2021/';
const option = {
  ca: fs.readFileSync(`${CP}My_CA_Bundle.ca-bundle.crt`), // Certificate BUNDLES
  cert: fs.readFileSync(`${CP}www_wordy-cloud_com.crt`), // correct
  key: fs.readFileSync(`${CP}comodo-ssl-key-2021.key`), // mostliekly correct  
  passphrase: process.env.COMODO_SSL_KEY_PASSWORD_2021, // password for the key
}

// Write the time today
console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
console.log("*********************************************************");
console.log(`${new Date().toString()}`);
console.log("*********************************************************");
console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");

// This is pretty interesting approach as if arugment is not specifically defined 'dev'
// The server will be consdering the 443 protocol (production)
// This data is also used for other apigateway to act differetnly, such as connect to DB 
export const IS_DEV_MODE = process.argv[2] === 'dev';

if (IS_DEV_MODE) {
  app.listen(PORT, () => {
    console.log(`DEVELOPMENT NON-SECURED SERVER running at PORT ${PORT}`);
  })
} else {
  // ****** RUNS HTTPS PRODUCTION SERVER ******
  https.createServer(option, app).listen(PORTHTTPS, () => {
    console.log(`ACTUAL SERVER running at PORT ${PORTHTTPS} (HTTPS)`);
  })
}