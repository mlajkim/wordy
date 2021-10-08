// Main
import express from 'express';
const router = express.Router();
// Imported Routers
import createUser from './user/createUser'
import getUser from './user/getUser'
import googleSignIn from './user/googleSignIn'

// Apply router
router.use(createUser);
router.use(getUser);
router.use(googleSignIn);

export default router;