// Stringify

function StringifyStyle (props) {
  const word = props.word;

  let pronunciation = '';
  let definition = '';
  let exampleSentence = '';

  // Check if the pronunciation exists
  if(word.pronunciation){
    pronunciation = ` [${word.pronunciation}]`;
  }

   // Check if the pronunciation exists
   if(word.definition){
     // Check if the pronunciation exists again.
     if(word.pronunciation){
      definition = ` ${word.definition}`;
    }else{
      definition = ` - ${word.definition}`;
    }
  }

  // Check if the exampleSentence exists
  if(word.exampleSentence){
    exampleSentence = ` = ${word.exampleSentence}`;
  }

  return `${word.word}${pronunciation}${definition}${exampleSentence}`
}

export default StringifyStyle;