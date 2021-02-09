import express from 'express';
// Routers
import v4Words from './words/v4Words';

const mongo = express.Router();

// Routers Apply
mongo.use('/words', v4Words);

export default mongo;