import React from 'react';
import Word from '../Word/Word';

import CardGroup from 'react-bootstrap/CardGroup';

class WordList extends React.Component {
  render() {
    return ( // Simply render 5 word for now
      <div>
        <CardGroup>
          {this.props.words.map(word => {
            return <Word words={word}/>
          })}
        </CardGroup>
      </div>
    );
  }
};

export default WordList;