import React from 'react';

const word = {
  owner_id: 1,
  date_created: 1590297520459, // May 24, 2020 (Sun)
  year: 2020,
  semester: 2,
  category_id: 2,
  word: 'revenous',
  pronunciation: 'reh-vuh-nus',
  definition: 'extremely hungry',
  example_sentence: 'I am revenous, where is my supper?'
};

class Word extends React.Component {
  render() {
    return (
      <div>
        <h1>{word.word}</h1>
        <p>[{word.pronunciation}] {word.example_sentence}</p>
        <h1>Owner id: {word.owner_id}</h1>
        <p>{word.year}-{word.semester}_{word.category_id}</p>
        <p>Date Created: {word.date_created}</p>
      </div>
    );
  }
}

export default Word;