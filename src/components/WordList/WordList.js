import React from 'react';
import Word from '../Word/Word';

class WordList extends React.Component {
  render() {
    return ( // Simply render 5 word for now
      <div>
        <Word />
        <Word />
        <Word />
        <Word />
        <Word />
      </div>
    );
  }
};