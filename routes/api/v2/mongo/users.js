const users = require('express').Router();

users.use((req, res, next) => {
  next();
});

// READ
users.get('', (req, res) => {
  
});

// CREATE 
users.post('', (req, res) => {
  
});

// UPDATE
users.put('', (req, res) => {
  
});

// DELETE
users.delete('', (req, res) => {
  
});

module.exports = users;