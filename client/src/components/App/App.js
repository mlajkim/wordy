// Import the necessity
import React from 'react';
import {BrowserRouter , Route, Switch} from 'react-router-dom';
import NavBar from '../NavBar/NavBar';

// Pages Import
import Home from '../pages/Home/Home';
import QuickReview from '../pages/QuickReview/QuickReview';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      words: [],
      currentWordId: 174
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.setCurrentWordId = this.setCurrentWordId.bind(this);
  }

  componentDidMount() {
    this.getWords();
  }

  getWords(){
    fetch(`/api/getWords/${this.state.currentWordId}`)
    .then(res => res.json())
    .then(words => this.setState({words}))
  }

  setCurrentWordId(newWordId){
    console.log(`I got thjis number: ${newWordId}`)
    this.setState({currentWordId: newWordId});
    this.componentDidMount(); // Hmm... I don't like it to be honest.
  }

  showCurrentPage() {
    return (
      <BrowserRouter>
        <Switch>
        <Route exact path='/' component={Home} />
          <Route exact path='/home' component={Home} />
          <Route exact path='/quickReview' render={(props) => {
            return <QuickReview words={this.state.words} setCurrentWordId={this.setCurrentWordId}/>
          }} />
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
