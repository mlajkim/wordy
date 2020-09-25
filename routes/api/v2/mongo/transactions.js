const transactions = require('express').Router();

transactions.use((req, res, next) => {
  next();
});

// READ
transactions.get('', (req, res) => {
  
});

// CREATE 
transactions.post('', (req, res) => {
  
});

// UPDATE
transactions.put('', (req, res) => {
  
});

// DELETE
transactions.delete('', (req, res) => {
  
});

module.exports = transactions;