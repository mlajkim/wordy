// Main & Types
import React, { Fragment } from 'react';
// Types
import { Word } from '../../types';
type Props = { word: Word, idx: number }

// @ MAIN
const WordList: React.FC<Props> = ({ word, idx }) => {
  let returningString: string = ``;
  const isPronunAvailable = word.pronun!== undefined && word.pronun.length > 0;

  // Making Word
  returningString += word.word// Word (Since it must exists)
  returningString += isPronunAvailable ? `[${word.pronun}]` : ''; // Pronun
  returningString += typeof word.meaning!== "undefined" && word.meaning.length > 0 ? (isPronunAvailable ? ` ${word.meaning}` : `:${word.meaning}`) : ''; // Meaning
  returningString += typeof word.example!== "undefined" && word.example.length > 0 ? `=${word.example}` : ''; // Example
  word.tag.forEach(tag => returningString += '#' + tag )
  
  return (
    <Fragment>
      <div style={{textAlign: 'left'}}>{returningString}</div>
    </Fragment>
  );
};

export default WordList;