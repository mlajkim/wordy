// Import the basics
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Import styles
import LoadingAnimationStyle from '../styles/LoadingAnimationStyle'
import WordCardStyle from '../styles/WordCardStyle';

//STATELESS FUNCTIONAL COMPONENTS
export function MongoReview (props) {
  let body;
  let isEmpty; 

  if(props.isLoaded) {
    isEmpty = props.wordsNow.length === 0 ? true : false;

    if (isEmpty) {
      body = <h1>The database is currently empty now :'(</h1>
    }
    else {
      body = (
        <div>
          <Card className="text-center">
            <Card.Header></Card.Header>
            <Card.Body>
              <Card.Title>
                {props.wordsNow[0].year}-{props.wordsNow[0].semester} "{props.wordsNow[0].language}"
              </Card.Title>
              {props.wordsNow.map(word => <WordCardStyle word={word} key={word._id} />)}
              <Button variant="primary" onClick={props.handleClickNextIndex}>Next</Button>
            </Card.Body>
            <Card.Footer className="text-muted">2 days ago</Card.Footer>
          </Card>
        </div>
      );
    }
  }

  return (
    <div>
      {!props.isLoaded && <LoadingAnimationStyle />}
      {body}
    </div>
  );

}

