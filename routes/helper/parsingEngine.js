// Import tools
const filterBadDataAndSplit = require('./filterBadDataAndSplit');
const parsingAlgorithm = require('./parsingAlgorithm');

const parsingEngine = (data) => {
  // Remove wrong type data and split them
  const dataArr = filterBadDataAndSplit(data);
  
  // Loop through the array of data ++ Get the parsedProperties
  const parsedProperties = dataArr.map(element => {
    // Simply Parseit 
    const parsedProperty = parsingAlgorithm(element);
        
    // Let express server viewer knows it has been parsed.
    console.log(parsedProperty.word);

    return parsedProperty;
        
  });

  // Return the properties.
  return parsedProperties;

}

module.exports = parsingEngine;