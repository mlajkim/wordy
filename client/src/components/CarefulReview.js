import React, {Component} from 'react';
import Review from './Review';

class CarefulReview extends Component {
  constructor(props) {
    super(props);
    this.props.getAllWords();
  }


  render() {
    return (
      <div>
        <h1>Hello Careful Review!</h1>
        <Review words={this.props.words}/>
      </div>
    );
  }
}

export default CarefulReview;