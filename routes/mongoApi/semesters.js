// Import and Declare the Router
const semestersRouter = require('express').Router();

// Import Mongoose Models
const semesterSchema = require('../../models/Semester');

semestersRouter.get('/:userId', async (req, res) => {
  // Find the semesterData based on the user
  const semesterData = await semesterSchema.find({owner: req.params.userId});

  res.json(semesterData)
})

// Export the router
module.exports = semestersRouter;