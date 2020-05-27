import React from 'react';
import './App.css';
import WordList from '../WordList/WordList';
import NavBar from '../NavBar/NavBar';


//Hard coded word
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

//Hard coded words
const words = [word, word, word, word, word];

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <WordList words={words}/>
      </div>
    );
  };
}

export default App;
