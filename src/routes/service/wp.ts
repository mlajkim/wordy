// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import changeWp from './wp/changeWp';

// Apply router
router.use(changeWp);

export default router;