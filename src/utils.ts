// Database
import {Request, Response, NextFunction} from 'express';
import { IS_DEV_MODE } from './server';
import mongoose from 'mongoose';
// Etc
import moment from 'moment';

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