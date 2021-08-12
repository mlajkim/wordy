// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import createMyOkr from './okr/createMyOkr';
import getMyOkr from './okr/getMyOkr';
import createOkr from './okr/createOkrObject';


// Apply router
router.use(createMyOkr);
router.use(getMyOkr);
router.use(createOkr);

export default router;