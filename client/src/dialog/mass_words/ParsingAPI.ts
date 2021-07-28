// Types
type ReturningType = {
  word: string, 
  pronun?: string, 
  meaning?: string, 
  example?: string, 
  tag?: string[] // this is actually required, but I wont solve it for now.
}

//@ MAIN
export default function ParsingAPI (massiveLine: string, sem: number, basicTags: string[]) {
  return massiveLine.split("\n").map(line => {return {...parsingMechanism(line, basicTags), sem, isPublic: false}});  
}

const parsingMechanism = (line: string, basicTags: string[]): ReturningType => {
  let ultimateReturn: ReturningType = { word: ''}; // tag will be empty by defeault
  line = line.trim();
  
  const tagIndex = line.search(/#/g); // -1 if not found. 
  if(tagIndex === -1) ultimateReturn = {...partA(line), tag: basicTags};
  else {
    ultimateReturn = partA(line.slice(0, tagIndex));
    ultimateReturn = {...ultimateReturn, tag:  [...partB(line.slice(tagIndex + 1), tagIndex), ...basicTags]} // does not include '='
  }
  // by default
  return ultimateReturn;
};

const partA = (partA: string): ReturningType => {
  let partATemporary: ReturningType = {word: partA};

  // example (sentence)
  const exampleIndex = partA.search(/=/g);
  if(exampleIndex !== -1) {
    partATemporary.example = partA.slice(exampleIndex + 1).trim()
    partA = partA.slice(0, exampleIndex);
  }

  // meaning
  const meaningIndex = partA.search(/[\]:]/g);
  if(meaningIndex !== -1) {
    partATemporary.meaning = partA.slice(meaningIndex + 1).trim()
    partA = partA.slice(0, meaningIndex);
  }

  // pronun
  const pronunIndex = partA.search(/\[/g);
  if(pronunIndex !== -1) {
    partATemporary.pronun = partA.slice(pronunIndex + 1).trim()
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

