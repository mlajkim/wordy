import React from 'react';
import './App.css';
import WordList from '../WordList/WordList';
import NavBar from '../NavBar/NavBar';

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <WordList />
      </div>
    );
  };
}

export default App;
