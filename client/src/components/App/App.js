import React from 'react';
import './App.css';
import NavBar from '../NavBar/NavBar';

// Pages Import
import Home from '../pages/Home/Home';
import QuickReview from '../pages/QuickReview/QuickReview';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'QuickReview',
      words: []
    };

    this.changePage = this.changePage.bind(this);
    this.returnCurrentPage = this.returnCurrentPage.bind(this);
  }

  componentDidMount() {
    this.getWords();
  }

  getWords(){
    fetch('/api/getWords')
    .then(res => res.json())
    .then(words => this.setState({words}))
  }

  changePage(newPage){
    this.setState({page: newPage});
  }

  returnCurrentPage(){
    if(this.state.page === 'QuickReview'){
      return <QuickReview words={this.state.words} />;
    }else if(this.state.page === 'Home'){
      return <Home />;
    }
  }

  render() {
    return (
      <div>
        <NavBar changePage={this.changePage} currentPage={this.state.page} />
        {this.returnCurrentPage()}
      </div>
    );
  };
}

export default App;
