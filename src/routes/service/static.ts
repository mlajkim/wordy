// Main
import express from 'express'
const router = express.Router()
// Imported Routers
import getStatic from './static/getStatic'

// Apply router
router.use(getStatic)

export default router;