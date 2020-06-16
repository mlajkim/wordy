// Import and Declare the Router
const semestersRouter = require('express').Router();

// Import Mongoose Models
const semesterSchema = require('../../models/Semester');

semestersRouter.get('/', async (req, res) => {
  const semesterData = await semesterSchema.find();

  res.json(semesterData)
})

// Export the router
module.exports = semestersRouter;