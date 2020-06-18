// Import the basics
import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export class MongoReview extends Component {  
  render() {
    return (
      <div>
        <Card className="text-center">
          <Card.Header><Button variant="outline-warning" onClick={this.props.handleClickRefresh}>Refresh</Button></Card.Header>
          <Card.Body>
            <Card.Title>Card title</Card.Title>
            {this.props.wordsNow.map(element => {
              return <Card key={element._id} body bg="light">{element.word} [{element.pronunciation}] {element.definition} = {element.exampleSentence}</Card>
            })}
            <Button variant="primary" onClick={this.props.handleClickNextIndex}>Next</Button>
          </Card.Body>
          <Card.Footer className="text-muted">2 days ago</Card.Footer>
        </Card>
      </div>
    );
  }
}

