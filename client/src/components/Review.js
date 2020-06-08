/**
 * Review.js handles word data and logs from user to provide
 * the correct words list for the application
 */

 // Import the necessary
import React, {Component} from 'react';

// React-Bootstrap Import
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';

class Review extends Component {
  render() {
    return (
      <div>
        <Card className="text-center">
          <Card.Header>
            My Words!
          </Card.Header>
          <Card.Body>
            Hey word!
          </Card.Body>
          <Card.Footer className="text-muted">
           <Button variant="outline-success" onClick={this.handleClick}>Next ⇒</Button>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}

export default Review;