import React, {Component} from 'react';
import Review from './Review';

class CarefulReview extends Component {
  render() {
    return (
      <div>
        <h1>Hello Careful Review!</h1>
        <Review />
      </div>
    );
  }
}

export default CarefulReview;