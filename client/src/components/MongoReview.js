// Import the basics
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Import styles
import LoadingAnimationStyle from '../styles/LoadingAnimationStyle'
import WordCardStyle from '../styles/WordCardStyle';

//STATELESS FUNCTIONAL COMPONENTS
export function MongoReview (props) {
  if(props.isLoaded) return (
    <div>
      <Card className="text-center">
        <Card.Header></Card.Header>
        <Card.Body>
          <Card.Title>
            {props.wordsNow[0].year}-{props.wordsNow[0].semester} "{props.wordsNow[0].language}"
          </Card.Title>
          {props.wordsNow.map(word => <WordCardStyle word={word}/>)}
          <Button variant="primary" onClick={props.handleClickNextIndex}>Next</Button>
        </Card.Body>
        <Card.Footer className="text-muted">2 days ago</Card.Footer>
      </Card>
    </div>
  );
  else return(
    <LoadingAnimationStyle />
  );
}

