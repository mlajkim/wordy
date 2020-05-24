import React from 'react';
import Card from 'react-bootstrap/Card';

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
      <Card border="secondary" style={{ width: '18rem' }}>
        <Card.Header>Owner: {word.owner_id}</Card.Header>
        <Card.Body>
          <Card.Title>{word.word} [{word.pronunciation}]</Card.Title>
          <Card.Text>{word.example_sentence}\nOwner:{word.owner_id}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default Word;