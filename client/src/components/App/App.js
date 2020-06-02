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
      words: []
    };
  }

  componentDidMount() {
    this.getWords();
  }

  getWords(){
    fetch('/api/getWords')
    .then(res => res.json())
    .then(words => this.setState({words}))
  }

  showCurrentPage() {
    return (
      <BrowserRouter>
        <Switch>
        <Route exact path='/' component={Home} />
          <Route exact path='/home' component={Home} />
          <Route exact path='/quickReview' render={(props) => {
            return <QuickReview words={this.state.words}/>
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
