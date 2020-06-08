/**
 * Review.js handles word data and logs from user to provide
 * the correct words list for the application
 */

 // Import the necessary
import React, {Component} from 'react';

// React-Bootstrap Import
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';

class Review extends Component {
  render() {
    return (
      <div>
        <Card className="text-center">
          <Card.Header>
            My Words!
          </Card.Header>
          <Card.Body>
            {this.props.words.map(word => {
                return <Word word={word}/>
            })}
          </Card.Body>
          <Card.Footer className="text-muted">
           <Button variant="outline-success" onClick={this.handleClick}>Next ⇒</Button>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}

class Word extends React.Component {
  render() {
    const word = this.props.word.word;
    const pronunciation = this.props.word.pronunciation ? ` [${this.props.word.pronunciation}] ` : ' [] ';
    const definition = this.props.word.definition ? ` ${this.props.word.definition} ` : '';
    const exampleSentence = this.props.word.exampleSentence ? `= ${this.props.word.definition}` : '';

    return (
      <Card>
        <Card.Body>{word}{pronunciation}{definition}{exampleSentence}</Card.Body>
      </Card> 
    );
  }
}

export default Review;