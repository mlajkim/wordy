// Types
type ReturningType = {
  word: string, 
  pronun?: string, 
  meaning?: string, 
  example?: string, 
  tag?: string[] // this is actually required, but I wont solve it for now.
}

//@ MAIN
export default function ParsingAPI (massiveLine: string, sem: number) {
  return massiveLine.split("\n").map(line => {return {...parsingMechanism(line), sem, isPublic: false}});  
}

const parsingMechanism = (line: string): ReturningType => {
  // Ideal Example
  // Parliament [par-luh-munt] 의회 (국회) .. = British Parliament
  // Parliament: 의회 (국회) = British Parliament
  // Parliament - 의회 인경우 Parliament - 의회
  let ultimateReturn: ReturningType = { word: '' }; // tag will be empty by defeault
  // Quicker Addition
  if(line.length >= 3 && parseInt(line.slice(0, 2)) !== NaN) {
    console.log('called')
    const code = parseInt(line.slice(0, 2));
    const enough = line.slice(2).split(" ").length >= 3
    if (enough) switch(code) {
      case 3:
        return three(line.slice(2));
      case 31:
        return threeOne(line.slice(3)); // two digits must be ...
      case 4:
        return four(line.slice(2));

      default: // just skip
    };
  }
  
  const tagIndex = line.search(/#/g); // -1 if not found. 
  if(tagIndex === -1) ultimateReturn = {...partA(line), tag: []};
  else {
    ultimateReturn = partA(line.slice(0, tagIndex));
    ultimateReturn = {...ultimateReturn, tag:  [...partB(line.slice(tagIndex + 1), tagIndex)]} // does not include '='
  }
  // by default
  return ultimateReturn;
};

const three = (line: string): ReturningType => { // word + meaning + example
  let answer: ReturningType = {word: line, tag: []}
  
  const wordIndex = line.search(/\s/g); // Word
  answer.word = line.slice(0, wordIndex);
  line = line.slice(wordIndex + 1);

  const meaningIndex = line.search(/\s/g); // Meaning
  answer.meaning = line.slice(0, meaningIndex);
  answer.example = line.slice(meaningIndex + 1); // Example

  return answer;
};

const threeOne = (line: string): ReturningType => { // word + pronun + meaning
  let answer: ReturningType = {word: line, tag: []}
  
  const wordIndex = line.search(/\s/g); // Word
  answer.word = line.slice(0, wordIndex);
  line = line.slice(wordIndex + 1);

  const pronunIndex = line.search(/\s/g); // Pronun
  answer.pronun = line.slice(0, pronunIndex);
  answer.meaning = line.slice(pronunIndex + 1); // Example

  return answer;
};

const four = (line: string): ReturningType => { // word + pronun + meaning + example
  let answer: ReturningType = {word: line, tag: []}
  
  const wordIndex = line.search(/\s/g); // Word
  answer.word = line.slice(0, wordIndex);
  line = line.slice(wordIndex + 1);

  const pronunIndex = line.search(/\s/g); // pronun
  answer.pronun = line.slice(0, pronunIndex);
  line = line.slice(pronunIndex + 1);

  const meaningIndex = line.search(/\s/g); // Meaning
  answer.meaning = line.slice(0, meaningIndex);
  answer.example = line.slice(meaningIndex + 1); // Example

  return answer;
};

const partA = (partA: string): ReturningType => {
  let partATemporary: ReturningType = {word: partA};

  // example (sentence)
  const exampleIndex = partA.search(/=/g);
  if(exampleIndex !== -1) {
    partATemporary.example = partA.slice(exampleIndex + 1)
    partA = partA.slice(0, exampleIndex);
  }

  // meaning
  const meaningIndex = partA.search(/[\]:]/g);
  if(meaningIndex !== -1) {
    partATemporary.meaning = partA.slice(meaningIndex + 1)
    partA = partA.slice(0, meaningIndex);
  }

  // pronun
  const pronunIndex = partA.search(/\[/g);
  if(pronunIndex !== -1) {
    partATemporary.pronun = partA.slice(pronunIndex + 1)
    partA = partA.slice(0, pronunIndex);
  }
  
  // finally, the word.
  partATemporary.word = partA;
  
  return partATemporary;
};

const partB = (partB: string, tagAt: number): string[] => {
  // handle tags
  return partB.replace("#", " ").split(" ").filter(elem => elem !== " ");
};

