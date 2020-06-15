import React from 'react';

// React-Bootstrap Import
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


class Home extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      parsetarget: '',
      checkboxYear: 'default',
      checkboxSem: 'default',
      userId: '5ee4ccfa4b391e1e931c4b64'
    }
    
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);

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
          this.state.parsetargetJapanese,
        ],
        "userPreference": {
          owner: this.state.userId,
          year: this.state.checkboxYear,
          semester: this.state.checkboxSem,
          isPublic: false
        }
        
      })
    })
    .then(res => res.json())
    .then(data => console.log(data));
    
  }

  onClickCheckbox(e){
    this.setState({[e.target.name]: e.target.value})
  }

  render() {
    return (
      <Form.Group controlId="exampleForm.ControlTextarea1">
        <Form.Label>Place your parsing targets here</Form.Label> 
        <Button onClick={this.handleSubmit}>Parse it!</Button>
        <br />
        <br />
        <div key="checkboxYear" className="mb-3">
          <Form.Check inline label="2017" onClick={this.onClickCheckbox} name="checkboxYear" value="2017" id="yearCheckbox1" />
          <Form.Check inline label="2018" onClick={this.onClickCheckbox} name="checkboxYear" value="2018" id="yearCheckbox2" />
          <Form.Check inline label="2019" onClick={this.onClickCheckbox} name="checkboxYear" value="2019" id="yearCheckbox3" />
          <Form.Check inline label="2020" onClick={this.onClickCheckbox} name="checkboxYear" value="2020" id="yearCheckbox4" />
          <Form.Check inline label="default" onClick={this.onClickCheckbox} name="checkboxYear" value="default" id="yearCheckbox5" />

        </div>

        <div key="checkboxSem" className="mb-3" >
          <Form.Check inline label="1st semester" onClick={this.onClickCheckbox} name="checkboxSem" value="1"id="semCheckbox1"/>
          <Form.Check inline label="2nd semester" onClick={this.onClickCheckbox} name="checkboxSem" value="2" id="semCheckbox2" />
          <Form.Check inline label="3rd semester" onClick={this.onClickCheckbox} name="checkboxSem" value="3" id="semCheckbox3" />
          <Form.Check inline label="4th semester" onClick={this.onClickCheckbox} name="checkboxSem" value="4" id="semCheckbox4" />
          <Form.Check inline label="default" onClick={this.onClickCheckbox} name="checkboxSem" value="default" id="semCheckbox5" />

        </div>
        
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