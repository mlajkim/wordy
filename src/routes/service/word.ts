// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import getWord from './word/getWord';
import word from './word/detectLanguage';

// Apply router
router.use(getWord);
router.use(word);

export default router;