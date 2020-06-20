import React from 'react';
import Home from '../components/Home'

class HomeContainer extends React.Component {
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
      <div>
        <Home 
          onChange={this.onChange}
          handleSubmit={this.handleSubmit}
          onClickCheckbox={this.onClickCheckbox}
        />
      </div>
    );
  };
}

export default HomeContainer;