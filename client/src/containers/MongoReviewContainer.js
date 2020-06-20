// Import the basics
import React, {Component} from 'react';

// Import Rendering Component
import {MongoReview} from '../components/MongoReview';

class MongoReviewContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      words: [],
      wordsNow: [],
      index: 0,
      howMany: 5,
      userId: '5ee4ccfa4b391e1e931c4b64'
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleClickNextIndex = this.handleClickNextIndex.bind(this);
    this.handleClickRefresh = this.handleClickRefresh.bind(this);
  } // constructor(props) ends

  componentDidMount() {
    // Load data
    fetch('/mongoApi/words', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(res => res.json())
    .then(result => {
      this.setState({words: result})
    })
    .catch(err => {
      // No log, set to 0
    })    
  } // componentDidMount() ends

  handleClickRefresh() {
    fetch('/mongoApi/logs/lastLog', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(res => res.json())
    .then(result => {
        const foundIndex = this.state.words.findIndex(element => element._id === result.wordId) + 1 // Add one for the next!
      this.setState({
        // First
        index: foundIndex
      }, () => {
        // Then
        this.setState({
          wordsNow: this.state.words.slice(this.state.index, this.state.index + this.state.howMany)
        })
      })
    })
  } // handleClickRefresh() ends

  handleClickNextIndex() {
    // Write the current logs
    const tempWordsNow = this.state.wordsNow;
    tempWordsNow.forEach(element => {
      fetch('/mongoApi/logs', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          userId: this.state.userId,
          dateReviewed: Date.now(),
          wordId: element._id
        })
      })
    })

    // Change to new words
    const newIndex = this.state.index + this.state.howMany;
    this.setState({
      index: newIndex
    }, () => {
      this.setState({
        wordsNow: this.state.words.slice(newIndex, newIndex + this.state.howMany)
      })
    })
    
    //Check if it reached the index
    if(this.state.words.length - this.state.howMany - 1 < newIndex){
      this.setState({
        index: 0,
        wordsNow: this.state.words.slice(0, this.state.howMany)
      })
    }
  } // handleClickNextIndex() ends
  
  render() {
    return (
      <div>
        <MongoReview 
          wordsNow={this.state.wordsNow}
          handleClickRefresh={this.handleClickRefresh}
          handleClickNextIndex={this.handleClickNextIndex}
         />
      </div>
    );
  } // render() ends
}

export default MongoReviewContainer;