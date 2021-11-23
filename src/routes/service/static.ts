// Main
import express from 'express'
const router = express.Router()
// Imported Routers
import askPermissionForPostStatic from './static/askPermissionForPostStatic'
import postStatic from './static/postStatic'
import getStatic from './static/getStatic'

// Apply router
router.use(askPermissionForPostStatic)
router.use(postStatic)
router.use(getStatic)

export default router;