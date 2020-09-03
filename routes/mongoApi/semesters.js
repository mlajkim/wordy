// Import and Declare the Router
const semestersRouter = require('express').Router();

// Import Mongoose Models
const semesterSchema = require('../../models/Semester');

semestersRouter.get('/:userId', async (req, res) => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }) 

  // Find the semesterData based on the user
  const query = {
    owner: req.params.userId
  }
  const semesterData = await semesterSchema.find(query);

  res.json(semesterData)
})

// Export the router
module.exports = semestersRouter;