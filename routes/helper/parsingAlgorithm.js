const parsingAlgorithm = (targetSentence) => {
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

module.exports = parsingAlgorithm;