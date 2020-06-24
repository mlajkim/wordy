// Import the necessity
import React from 'react';
import {BrowserRouter , Route, Switch} from 'react-router-dom';
import NavBar from './NavBar';

// Pages Import
import HomeContainer from '../containers/HomeContainer';
import MongoReviewContainer from '../containers/MongoReviewContainer';
import ListContainer from '../containers/ListContainer';
import ProgressContainer from '../containers/ProgressContainer';
// carefulReview
import SignIn from './SignIn';
import NewListContainer from '../containers/NewListContainer';

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
        <Route exact path='/newList' component={NewListContainer} />
        <Route exact path='/list' component={ListContainer} />
        <Route exact path='/progress' component={ProgressContainer} />
        <Route exact path='/signin' component={SignIn} />
      </Switch>
    </BrowserRouter>
  );
}

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        {showCurrentPage()}
      </div>
    );
  };
}

export default App;
