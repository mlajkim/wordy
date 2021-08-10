// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import getMyOkr from './okr/getMyOkr';

// Apply router
router.use(getMyOkr);

export default router;