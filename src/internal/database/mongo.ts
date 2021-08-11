import {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
// Value
import { IS_DEV_MODE } from '../../server';
 

export const connectToMongoDB = (_req: Request, _res: Response, next: NextFunction) => {
  if (IS_DEV_MODE) {
    const url = process.env.LOCAL_MONGO_SERVER_URL as string;
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    
  } 
  
  else {
    const MONGO_OWNER_NAME = process.env.MONGO_OWNER_NAME;
    const MONGO_CLUSTER_PASSWORD = process.env.MONGO_CLUSTER_PASSWORD;
    const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME;
    const url = `mongodb+srv://${MONGO_OWNER_NAME}:${MONGO_CLUSTER_PASSWORD}@${MONGO_DATABASE_NAME}`;
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  };

  next();
};