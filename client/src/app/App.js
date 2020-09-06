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
      userId: '',
      words: [],
      
    }
  }
  render() {
    return (
      <div>
        <NavBar />
        {showCurrentPage()}
      </div>
    );
  };
}

function showCurrentPage() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={HomeContainer} />
        <Route exact path='/home' component={HomeContainer} />
        <Route 
          exact path='/quickReview'
          render={(props) => (
            <MongoReviewContainer {...props} type="quick" />
          )}
        />
        <Route 
          exact path='/carefulReview'
          render={(props) => (
            <MongoReviewContainer {...props} type="careful" />
          )}
        />
        <Route exact path='/list' component={ListContainer} />
        <Route exact path='/progress' component={ProgressContainer} />
        <Route exact path='/signin' component={SignIn} />
      </Switch>
    </BrowserRouter>
  );
}
