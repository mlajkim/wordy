// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import createMyOkr from './okr/createMyOkr';
import getMyOkr from './okr/getMyOkr';
import createOkr from './okr/createOkrObject';
import getOkrObject from './okr/getOkrObject';

// Apply router
router.use(createMyOkr);
router.use(getMyOkr);
router.use(createOkr);
router.use(getOkrObject);

export default router;