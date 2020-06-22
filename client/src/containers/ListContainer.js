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
      isLoaded: false,
      userId: '5ee4ccfa4b391e1e931c4b64'
    }

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    // Load Semesters Data First
    const response = await fetch('/mongoApi/semesters', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    const json = await response.json();
    this.setState({semesters: json});

    // Load Words Data
    const responseData = await fetch('/mongoApi/words/semesterized', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })
    const jsonData = await responseData.json();

    // Write the result of the data
    this.setState({
      words: jsonData,
      isLoaded: true
    });

  }

  render() {
    return (
      <div>
        <List 
          semesters={this.state.semesters}
          words={this.state.words}
          isLoaded={this.state.isLoaded}
          userId={this.state.userId}
          handleClickEdit={this.handleClickEdit}
        />
      </div>
    );
  }
}
export default ListContainer;