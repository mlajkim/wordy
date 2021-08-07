// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import createUser from './user/createUser';

// Apply router
router.use(createUser);

export default router;