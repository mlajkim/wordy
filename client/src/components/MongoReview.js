import React, {Component} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

class MongoReview extends Component {
  constructor(props){
    super(props);
    this.state = {
      words: [],
      wordsNow: [],
      index: 0,
      howMany: 5
    }

    this.handleClickNextIndex = this.handleClickNextIndex.bind(this);
    this.handleClickRefresh = this.handleClickRefresh.bind(this);
  }

  handleClickNextIndex() {
    this.setState({
      index: this.state.index + this.state.howMany,
      wordsNow: this.state.words.slice(this.state.index, this.state.index + 5)
    })

    //Check if it reached the index
    if(this.state.words.length-6 < this.state.index){
      this.setState({
        index: 0,
        wordsNow: this.state.words.slice(this.state.index, this.state.index + 5)
      })
    }

    //Testing
    console.log(this.state.words.length +'index' +  this.state.index)
  }

  handleClickRefresh() {
    fetch('/mongoApi/words', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(res => res.json())
    .then(result => {
      this.setState({
        words: result
      })
    });
  }
  
  render() {
    return (
      <div>
        <Card className="text-center">
          <Card.Header><Button variant="outline-warning" onClick={this.handleClickRefresh}>Refresh</Button></Card.Header>
          <Card.Body>
            <Card.Title>2020-2 English</Card.Title>
            {this.state.wordsNow.map(element => {
              return <Card key={element._id} body bg="light">{element.word} [{element.pronunciation}] {element.definition} = {element.exampleSentence}</Card>
            })}
            <Button variant="primary" onClick={this.handleClickNextIndex}>Next</Button>
          </Card.Body>
          <Card.Footer className="text-muted">2 days ago</Card.Footer>
        </Card>
      </div>
    );
  }
}

export default MongoReview;