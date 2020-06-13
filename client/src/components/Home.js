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
        "parsetarget": [
          this.state.parsetarget,
          this.state.parsetargetEnglish,
          this.state.parsetargetChinese,
          this.state.parsetargetJapanese
        ]
        
      })
    })
    .then(res => res.json())
    .then(data => console.log(data));
    
  }

  render() {
    return (
      <Form.Group controlId="exampleForm.ControlTextarea1">
        <Form.Label>Place your parsing targets here</Form.Label> 
        <Button onClick={this.handleSubmit}>Parse it!</Button>
        <br />
        <Form.Label>KOREAN</Form.Label> 
        <Form.Control style={{marginBottom: 15}} name="parsetarget" as="textarea" rows="4" onChange={this.onChange}/>
        <Form.Label>ENGLISH</Form.Label> 
        <Form.Control style={{marginBottom: 15}} name="parsetargetEnglish" as="textarea" rows="4" onChange={this.onChange}/>
        <Form.Label>CHINESE</Form.Label> 
        <Form.Control style={{marginBottom: 15}} name="parsetargetChinese" as="textarea" rows="4" onChange={this.onChange}/>
        <Form.Label>JAPANESE</Form.Label> 
        <Form.Control style={{marginBottom: 15}} name="parsetargetJapanese" as="textarea" rows="4" onChange={this.onChange}/>

      </Form.Group>      
    );
  };
}

export default Home;