// Import the necessity
import React from 'react';
import {BrowserRouter , Route, Switch} from 'react-router-dom';
import NavBar from '../components/NavBar';

// Pages Import
import HomeContainer from '../containers/HomeContainer';
import MongoReviewContainer from '../containers/MongoReviewContainer';
import ListContainer from '../containers/ListContainer';
import ProgressContainer from '../containers/ProgressContainer';
// carefulReview
import SignIn from '../components/SignIn';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // 5ee7437a908c1c3c080c4043
    this.state = {
      userId: '5ee7437a908c1c3c080c4043',
      words: [],
      
    }
    this.retrieveWords = this.retrieveWords.bind(this);

  };

  async retrieveWords() {
    // Will eventually develop the below
    // const userId = this.state.userId;

    let response = await fetch('/mongoApi/words', {
      method: 'GET',
      headers: {'Content-Type':'application/json'}
    })

    const words = await response.json();
    this.setState({words: words});

  };

  render() {
    return (
      <div>
        <NavBar />
        <BrowserRouter>
          <Switch>
            <Route 
              exact path='/'
              render={(props) => (
                <HomeContainer {...props} retrieveWords={this.retrieveWords}/>
              )}
            />
            <Route 
              exact path='/home'
              render={(props) => (
                <HomeContainer {...props} retrieveWords={this.retrieveWords}/>
              )}
            />
            <Route 
              exact path='/quickReview'
              render={(props) => (
                <MongoReviewContainer {...props}
                  type="quick" 
                />
              )}
            />
            <Route 
              exact path='/carefulReview'
              render={(props) => (
                <MongoReviewContainer {...props}
                  type="careful" 
                />
              )}
            />
            <Route exact path='/list' component={ListContainer} />
            <Route exact path='/progress' component={ProgressContainer} />
            <Route exact path='/signin' component={SignIn} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  };
}
