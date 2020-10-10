import axios from 'axios';
import * as API from '../../API';

type ReturningType = {
  word: string, 
  pronun?: string, 
  meaning?: string, 
  example?: string, 
  tag?: string[]
}

//@ MAIN
const ParsingAPI = (massiveLine: string, year: number, sem: number) => {
  const data = massiveLine.split("\n").map(line => parseA(line));
  syncBack(data, year, sem);
  syncFront(data);
}

const syncBack = (data: ReturningType[], year: number, sem: number) => {
  axios.post(`/api/v2/mongo/words/chunk`, {
    payload: {
      data
  }, extra: {
      year, sem
  }}, API.getAuthorization())
};

const syncFront = (data: ReturningType[]) => {

};

const parseA = (line: string): ReturningType => {
  // Ideal Example
  // Parliament [par-luh-munt] 의회 (국회) .. = British Parliament
  // Parliament: 의회 (국회) = British Parliament
  // Parliament - 의회 인경우 Parliament - 의회
  if(isGramaticallyWrong(line)) return { word: line }
  let ultimateReturn: ReturningType = { word: '' };
  
  const tagIndex = line.search(/#/g); // -1 if not found. 
  if(tagIndex === -1) ultimateReturn = partA(line);
  else {
    ultimateReturn = partA(line.slice(0, tagIndex));
    ultimateReturn = {...ultimateReturn, tag: [...partB(line.slice(tagIndex + 1), tagIndex)]} // does not include '='
  }
  console.log(ultimateReturn)
  // by default
  return ultimateReturn;
};

const isGramaticallyWrong = (line: string): boolean => {
  return false;
}

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
}

const partB = (partB: string, tagAt: number): string[] => {
  // handle tags
  return partB.replace("#", " ").split(" ").filter(elem => elem !== " ");
}






export default ParsingAPI;