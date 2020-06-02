import React from 'react';

// React-Bootstrap Import
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';

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

class QuickReview extends React.Component { 
  constructor(props){
    super(props);

    this.handleClick = this.handleClick.bind(this);
  } 

  handleClick(e) {
    this.props.setCurrentWordId(this.props.words[4].id + 1);
  }

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
    );
  };
}

export default QuickReview;