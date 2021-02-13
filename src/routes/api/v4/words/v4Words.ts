import express from 'express';
// Routers
import v4WordsPost from './v4WordsPost';
import v4PrivateWordsDelete from './v4PrivateWordsDelete';

const words = express.Router();

// Routers Apply
words.use('/public', v4WordsPost);
words.use('/private', v4PrivateWordsDelete);

export default words;