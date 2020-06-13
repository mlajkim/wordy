import React from 'react';

// React-Bootstrap Import
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      parsetarget: ''
    }
    
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Handles the change of form with the correct data!
  onChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }
  
  // Initiated when the button is clicked for the parsing!
  handleSubmit(e){
    fetch('/mongoApi/words', {
      method: 'POST',
      headers: {'Content-Type':'application/json'}, // super important
      body: JSON.stringify({
        "parsetarget": this.state.parsetarget
      })
    })
    .then(res => res.json())
    .then(data => console.log(data));
    
  }

  render() {
    return (
      <Form.Group controlId="exampleForm.ControlTextarea1">
        <Form.Label>Place your parsing targets here</Form.Label>
        <Form.Control name="parsetarget" as="textarea" rows="25" onChange={this.onChange}/>
        <Button onClick={this.handleSubmit}>Parse it!</Button>
      </Form.Group>      
    );
  };
}

export default Home;