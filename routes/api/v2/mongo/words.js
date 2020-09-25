const words = require('express').Router();

words.use((req, res, next) => {
  next();
});

// READ
words.get('', (req, res) => {
  
});

// CREATE 
words.post('', (req, res) => {
  
});

// UPDATE
words.put('', (req, res) => {
  
});

// DELETE
words.delete('', (req, res) => {
  
});

module.exports = words;
