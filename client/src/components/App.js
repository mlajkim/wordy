// Import the necessity
import React from 'react';
import {BrowserRouter , Route, Switch} from 'react-router-dom';
import NavBar from './NavBar';

// Pages Import
import HomeContainer from '../containers/HomeContainer';
import MongoReviewContainer from '../containers/MongoReviewContainer';
import ListContainer from '../containers/ListContainer';
import SignIn from './SignIn';

function showCurrentPage() {
  return (
    <BrowserRouter>
      <Switch>
      <Route exact path='/' component={HomeContainer} />
        <Route exact path='/home' component={HomeContainer} />
        <Route exact path='/mongoReview' component={MongoReviewContainer} />
        <Route exact path='/list' component={ListContainer} />
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
