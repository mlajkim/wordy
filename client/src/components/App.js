// Import the necessity
import React from 'react';
import {BrowserRouter , Route, Switch} from 'react-router-dom';
import NavBar from './NavBar';

// Pages Import
import HomeContainer from '../containers/HomeContainer';
import MongoReviewContainer from '../containers/MongoReviewContainer';
import ListContainer from '../containers/ListContainer';
import QuickReview from './QuickReview';
import CarefulReview from './CarefulReview';
import SignIn from './SignIn';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      words: [],
      currentWordId: 174,
      allWords: []
    };


    // The belows are the SQLite Function
    this.componentDidMount = this.componentDidMount.bind(this);
    this.setCurrentWordId = this.setCurrentWordId.bind(this);
    this.getAllWords = this.getAllWords.bind(this);
  }

  // The belows are the SQLite functions

  componentDidMount() {
    this.getWords();
  }

  getAllWords() {
    fetch('/api/getWords')
    .then(res => res.json())
    .then(allWords => this.setState({allWords}))
  }

  getWords(){
    fetch(`/api/getWords/${this.state.currentWordId}`)
    .then(res => res.json())
    .then(words => this.setState({words}))
  }

  setCurrentWordId(newWordId){
    console.log(`I got thjis number: ${newWordId}`)
    this.setState({currentWordId: newWordId});
    this.getWords(); // Hmm... I don't like it to be honest.
  }

  showCurrentPage() {
    return (
      <BrowserRouter>
        <Switch>
        <Route exact path='/' component={HomeContainer} />
          <Route exact path='/home' component={HomeContainer} />
          <Route exact path='/mongoReview' component={MongoReviewContainer} />
          <Route exact path='/list' component={ListContainer} />
          <Route exact path='/review/quick' 
            render={(props) => {
              return <QuickReview words={this.state.words} setCurrentWordId={this.setCurrentWordId}/>
            }} 
          />
          <Route exact path='/review/careful' 
            render={(props) => {
              return <CarefulReview words={this.state.allWords} getAllWords={this.getAllWords}/>
            }}
          />
          <Route exact path='/signin' component={SignIn} />
        </Switch>
      </BrowserRouter>
    );
  }

  render() {
    return (
      <div>
        <NavBar />
        {this.showCurrentPage()}
      </div>
    );
  };
}

export default App;
