// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import createMyOkr from './okr/createMyOkr';
import getMyOkr from './okr/getMyOkr';

// Apply router
router.use(createMyOkr);
router.use(getMyOkr);

export default router;