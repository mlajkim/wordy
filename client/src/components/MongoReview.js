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

    this.handleClickRefresh = this.handleClickRefresh.bind(this);
  }

  wordCard = (
    <div>
      <Card body bg="light">This is some text within a card body.</Card>
    </div>
  );

  handleClickRefresh() {
    fetch('/mongoApi/words', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(res => res.json())
    .then(result => console.log(result));
  }

  render() {
    return (
      <div>
        <Card className="text-center">
          <Card.Header><Button variant="outline-warning" onClick={this.handleClickRefresh}>Refresh</Button></Card.Header>
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