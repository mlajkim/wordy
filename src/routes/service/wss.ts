// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import signOut from './wss/signOut';

// Apply router
router.use(signOut);

export default router;