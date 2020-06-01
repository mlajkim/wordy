import React from 'react';

// React-Bootstrap Import
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class Home extends React.Component {
  render() {
    return (
      <div>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Example textarea</Form.Label>
          <Form.Control as="textarea" rows="3" />
        </Form.Group>
        <Button variant="primary">Submit for Parsing</Button>
      </div>
      
    );
  };
}

export default Home;