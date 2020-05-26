import React from 'react';
import Word from '../Word/Word';

import CardGroup from 'react-bootstrap/CardGroup';

class WordList extends React.Component {
  render() {
    return ( // Simply render 5 word for now
      <div>
        <CardGroup>
          <Word />
          <Word />
          <Word />
          <Word />
          <Word />
        </CardGroup>
      </div>
    );
  }
};

export default WordList;