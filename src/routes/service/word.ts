// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import word from './word/detectLanguage';

// Apply router
router.use(word);

export default router;