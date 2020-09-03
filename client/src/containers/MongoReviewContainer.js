// Import the basics
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// Import Rendering Component
import {MongoReview} from '../components/MongoReview';

const propType = {
  isLoaded: PropTypes.bool,
  wordsNow: PropTypes.array,
  handleClickNextIndex: PropTypes.func.isRequired
}

const defaultProps = {
  isLoaded: false,
  wordsNow: []
};

class MongoReviewContainer extends Component {
  constructor(props){
    super(props);

    this.state = {
      type: this.props.type,
      isLoaded: false,
      words: [],
      wordsNow: [],
      index: 0,
      howMany: 5,
      userId: '5ee4ccfa4b391e1e931c4b64'
    }

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleClickNextIndex = this.handleClickNextIndex.bind(this);
  } // constructor(props) ends

  async componentDidMount() {
    // Load data
    const response = await fetch('/mongoApi/words', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    const wordsDataArr = await response.json();

    // Get the lastLog corresponding to the last log
    const responseLastLog = await fetch(`/mongoApi/logs/lastLog/${this.state.type}`, {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    const lastLogData = await responseLastLog.json();

    // Find the next upcomming index accordingly
    let foundIndex;

    if(lastLogData.dbStatus === 'notFound') {
      //if not found
      foundIndex = 0;
      
    }else{
      foundIndex = wordsDataArr.findIndex(word => word._id === lastLogData.wordId) + 1
    }
    
    // Set the value
    this.setState({ 
      words: wordsDataArr,
      index: foundIndex,
      wordsNow: wordsDataArr.slice(foundIndex, foundIndex + this.state.howMany),
      isLoaded: true
    })
  } // componentDidMount() ends

  handleClickNextIndex() {
    // Write the current logs
    const tempWordsNow = this.state.wordsNow;
    tempWordsNow.forEach(element => {
      fetch('/mongoApi/logs', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          userId: this.state.userId,
          type: this.state.type,
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
          isLoaded={this.state.isLoaded} 
          wordsNow={this.state.wordsNow}
          handleClickNextIndex={this.handleClickNextIndex}
         />
      </div>
    );
  } // render() ends
}

MongoReviewContainer.propType = propType;
MongoReviewContainer.defaultProps = defaultProps;

export default MongoReviewContainer;