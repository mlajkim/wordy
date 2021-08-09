// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import createUser from './user/createUser';
import getUser from './user/createUser';

// Apply router
router.use(createUser);
router.use(getUser);

export default router;