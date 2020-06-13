/**
 * This serves as an algorithm where it removes not fitting / blank lines of 
 * parsing target codes.
 * 
 */

const filterBadDataAndSplit = (data) => {
  // Removes any blank line
  const dataArr = data.split("\n").filter(element => {
    if(element !== '') return true; // Only when it is not empty string
    else return false; 
  }).map(element => element.trim());

  return dataArr;
}

module.exports = filterBadDataAndSplit;