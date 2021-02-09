import express from 'express';
// Routers
import v4WordsPost from './v4WordsPost';

const words = express.Router();

// Routers Apply
words.use('', v4WordsPost);

export default words;