// Import the basics
import React, {Component} from 'react';

// Import Component
import List from '../components/List';

class ListContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      words: [],
      semesters: [],
      userId: '5ee4ccfa4b391e1e931c4b64'
    }

    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    // Load Semesters Data First
    fetch('/mongoApi/semesters', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(result => result.json())
    .then(data => this.setState({semesters: data}))
    .catch(err => console.log(err))

    // Load Words Data
    fetch('/mongoApi/words/semesterized', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    .then(result => result.json())
    .then(data => this.setState({words: data}))
    .catch(err => console.log(err))

  }

  render() {
    return (
      <div>
        <List 
          semesters={this.state.semesters}
          words={this.state.words}
          userId={this.state.userId}
        />
      </div>
    );
  }
}
export default ListContainer;