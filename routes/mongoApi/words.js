// Import and Declare the Router
const wordsRouter = require('express').Router();

// Import MongoDB related and its related declaratin
const mongoose = require('mongoose')
const yourDatabaseName = 'wordy-local'
const url = `mongodb://127.0.0.1:27017/${yourDatabaseName}`;

// Here
wordsRouter.get('/', (req, res) => {
  res.send('Hello words!')
});

wordsRouter.post('/', (req, res) => {

  smallEngine(req.body.parsetarget);
  
  const message = {
    state: 'success',
    contents: req.body.parsetarget
  }

  res.send(message);
});

const smallEngine = data => {
  // 1) Split the recieved data & Filters blank data 
  const dataArr = data.split("\n").filter(element => {
    if(element !== '') return true; // Only when it is not empty string
    else return false; 
  }).map(element => element.trim());

  // 2) Parse into properties
  const parsedPropertiesArr = dataArr.map(element => {
    // Simply Parseit 
    const parsedProperty = parseIt(element);
        
    // Let express server viewer knows it has been parsed.
    console.log(parsedProperty.word);

    return parsedProperty;
        
  });

  // 3) Save into MongoDB
  saveIt(parsedPropertiesArr);
}

// Parsing Engine
const parseIt = (targetSentence) => {
  const parsedProperty = {};

  let isPronunciated = false;
  let isDefined = false;
  let isExamplified = false;

  if(targetSentence.search(/\[/g) >= 0) isPronunciated = true;
  if(targetSentence.search(/[[-]/g) >= 0) isDefined = true;
  if(targetSentence.search(/=/g) >= 0) isExamplified = true;

  // Example Clear
  if(isExamplified){
    parsedProperty.exampleSentence = targetSentence.split('=')[1].trim();
  }

  // Pronunciation Clear
  if(isPronunciated){
    const regex = /.*\[(?<pronunciation>.*)\s*\]/g;
    parsedProperty.pronunciation = regex.exec(targetSentence).groups['pronunciation'].trim();
  }

  // Get Word - Definition
  if(isDefined && isPronunciated){
    const regex = /\s*(?<word>.*)\s*\[.*\]\s*(?<definition>\S.*)/g;
    const group = regex.exec(targetSentence).groups;

    parsedProperty.word = group.word.trim();
    parsedProperty.definition = group.definition.split('=')[0].trim();
  }else if(isDefined && !isPronunciated){
    const regex = /\s*(?<word>.*)\s*-\s*(?<definition>\S.*)/g;
    const group = regex.exec(targetSentence).groups;

    parsedProperty.word = group.word.trim();
    parsedProperty.definition = group.definition.split('=')[0].trim();
  }

  if(isPronunciated && isDefined && isExamplified){
    const regex = /\s*(?<word>.*)\s*\[.*\]\s*(?<definition>.*)\s*=/g;
    const group = regex.exec(targetSentence).groups;

    parsedProperty.word = group.word.trim();
    parsedProperty.definition = group.definition.trim();

  }else if(isPronunciated && isDefined && !isExamplified){
    const regex = /\s*(?<word>.*)\s*\[.*\]\s*(?<definition>.*)\s*/g;
    const group = regex.exec(targetSentence).groups;

    parsedProperty.word = group.word.trim();
    parsedProperty.definition = group.definition.trim();
  }

  // just_love_it Clear
  if(!isDefined){
    parsedProperty.word = targetSentence;

  }

  // Date added
  parsedProperty.dateAdded = Date.now();

  return parsedProperty;

};

// Saving data into MongoDB Engine
const saveIt = (parsedProperties) => {
  mongoose.connect(url, { useNewUrlParser: true })

  const db = mongoose.connection;
  db.once('open', _ => {
    console.log('*****************');
    console.log(`MONGO DB CONNECTED // DATABASE NAME: ${yourDatabaseName}`)
    console.log('*****************')
  })

  db.on('error', err => {
    console.error('connection error:', err)
  })

  db.collection('words').insertMany(parsedProperties);
}

// Export the router
module.exports = wordsRouter;