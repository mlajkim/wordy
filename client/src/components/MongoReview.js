import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class MongoReview extends Component {
  constructor(props){
    super(props);
    this.state = {
      words: [],
      wordsNow: ['hey', 'hey', 'hey', 'hey', 'hey']
    }
  }

  wordCard = (
    <div>
      <Card body>This is some text within a card body.</Card>
    </div>
  );

  render() {
    return (
      <div>
        <Card className="text-center">
          <Card.Header>Featured</Card.Header>
          <Card.Body>
            <Card.Title>2020-2 English</Card.Title>
            {this.state.wordsNow.map(element => {
              return this.wordCard;
            })}
            <Button variant="primary">Next</Button>
          </Card.Body>
          <Card.Footer className="text-muted">2 days ago</Card.Footer>
        </Card>
      </div>
    );
  }
}

export default MongoReview;