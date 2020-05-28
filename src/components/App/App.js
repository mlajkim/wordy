import React from 'react';
import './App.css';
import NavBar from '../NavBar/NavBar';

// Pages Import
import WordList from '../WordList/WordList';
import Home from '../pages/Home/Home';

// For test
import Button from 'react-bootstrap/Button'

//Hard coded word
const word = {
  owner_id: 1,
  date_created: 1590297520459, // May 24, 2020 (Sun)
  year: 2020,
  semester: 2,
  category_id: 2,
  word: 'revenous',
  pronunciation: 'reh-vuh-nus',
  definition: 'extremely hungry',
  example_sentence: 'I am revenous, where is my supper?'
};

//Hard coded words
const words = [word, word, word, word, word];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'QuickReview'
    };

    this.changePage = this.changePage.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }

  changePage(newPage){
    this.setState({page: newPage});
  }

  returnCurrentPage(){
    if(this.state.page === 'QuickReview'){
      return <WordList words={words}/>;
    }else if(this.state.page === 'Home'){
      return <Home />;
    }
  }

  handleClick(event) {
    const newPage = event.target.newPage;
    this.changePage(newPage);
    
    event.preventDefault();

  }

  render() {
    return (
      <div>
        <NavBar handleClick={this.handleClick} currentPage={this.state.page} />
        {this.returnCurrentPage()}
      </div>
    );
  };
}

export default App;
