// Database
import {Request, Response, NextFunction} from 'express';
import { IS_DEV_MODE } from './server';
import mongoose from 'mongoose';
// Secrets
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
// Etc
import moment from 'moment';
// Types
import { TokenType } from './typesBackEnd';
// Json
import standard from './businessStandard.json';
import response from './responseStandard.json';

// V4
export const connectToMongoDB = (_req: Request, _res: Response, next: NextFunction) => {
  if (IS_DEV_MODE) {
    const url = process.env.LOCAL_MONGO_SERVER_URL as string;
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    process.stdout.write('[LOCAL]\n')
  } else {
    const MONGO_OWNER_NAME = process.env.MONGO_OWNER_NAME;
    const MONGO_CLUSTER_PASSWORD = process.env.MONGO_CLUSTER_PASSWORD;
    const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME;
    const url = `mongodb+srv://${MONGO_OWNER_NAME}:${MONGO_CLUSTER_PASSWORD}@${MONGO_DATABASE_NAME}`;
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    process.stdout.write('[LIVE]\n')
  }
  next();
};

// V4
// @ MIDDLEWARE: AUTHENTICATION
export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.header('Authorization');
  const authType = req.header('AuthType');

  // Secret handler
  const secretKey = authType === "REFRESH_TOKEN" ? process.env.V4_REFRESH_TOKEN_SECRET! : process.env.V4_ACCESS_TOKEN_SECRET!;

  // Handle when token not given.
  if(accessToken == null) {
    const status = 401;
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message
    });
  };

  // Verify
  jwt.verify(accessToken!, secretKey, (err: any, user: any) => {
    if (err) {
      const status = 403;
      return res.status(403).send({
        status: response[status].status,
        message: response[status].message,
        details: "If you are attempting to get refresh token, make sure to provide AuthType header with REFRESH_TOKEN."
      });
    };
      
    req.body.user = user;
    process.stdout.write(`[V4] [${user.firstName} ${user.lastName}] [${user.email}]`);
    next();
  });
};

export const minimizeUserData = (user: any) => {
  return {
    ID: user._id,
    federalID: user.federalID,
    federalProvider: user.federalProvider,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  }
}

// V4
export const generateToken = (
  data: any,
  tokenType: TokenType
) => {
  dotenv.config();
  
  return jwt.sign(
    data, 
    process.env[tokenType]!, 
    { expiresIn: standard[tokenType].expiresIn }
  );
};

export const getDate = () => {
  const now = moment();
  const year = parseInt(now.format('YYYY'));
  const month = parseInt(now.format('MM'));
  let sem = 1;
  if(month <= 3) sem = 1;
  else if (month <= 6) sem = 2;
  else if (month <= 9) sem = 3;
  else sem = 4;

  return {now, year, sem}
  
}