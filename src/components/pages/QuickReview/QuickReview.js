import React from 'react';

// React-Bootstrap Import
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

class Word extends React.Component {
  render() {
    return (
      <Card border="secondary" style={{ width: '18rem' }}>
        <Card.Header>Owner: {this.props.word.owner_id}</Card.Header>
        <Card.Body>
          <Card.Title>{this.props.word.word} [{this.props.word.pronunciation}]</Card.Title>
          <Card.Text>{this.props.word.example_sentence} <br /><br />Owner:{this.props.word.owner_id}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

class QuickReview extends React.Component {
  render() {
    return (
      <div>
        <CardGroup>
          {this.props.words.map(word => {
            return <Word word={word}/>
          })}
        </CardGroup>
        <Button variant="success">Next!</Button>
      </div>
    );
  };
}

export default QuickReview;