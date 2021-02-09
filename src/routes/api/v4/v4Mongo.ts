import express from 'express';
// Routers
import v4Words from './words/v4Words';
// utils
import { authenticateUser, connectToMongoDB } from '../../../utils';

const mongo = express.Router();

// Routers Apply
mongo.use(authenticateUser);
mongo.use(connectToMongoDB);
mongo.use('/words', v4Words);

export default mongo;