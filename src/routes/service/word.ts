// Main
import express from 'express'
const router = express.Router()
// Imported Routers
import editWords from './word/editWords'
import postWords from './word/postWords'
import getWord from './word/getWord'
import word from './word/detectLanguage'

// Apply router
router.use(editWords)
router.use(postWords)
router.use(getWord)
router.use(word)

export default router;