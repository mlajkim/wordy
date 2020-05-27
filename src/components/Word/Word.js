import React from 'react';
import Card from 'react-bootstrap/Card';

class Word extends React.Component {
  render() {
    return (
      <Card border="secondary" style={{ width: '18rem' }}>
        <Card.Header>Owner: {this.props.word.owner_id}</Card.Header>
        <Card.Body>
          <Card.Title>{this.props.word.word} [{this.props.word.pronunciation}]</Card.Title>
          <Card.Text>{this.props.word.example_sentence} <br />Owner:{this.props.word.owner_id}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default Word;
