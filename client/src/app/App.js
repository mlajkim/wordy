// Import the necessity
import React from 'react';

/*
import {BrowserRouter , Route, Switch} from 'react-router-dom';
import NavBar from '../components/NavBar';

// Pages Import
import HomeContainer from '../containers/HomeContainer';
import MongoReviewContainer from '../containers/MongoReviewContainer';
import ListContainer from '../containers/ListContainer';
import ProgressContainer from '../containers/ProgressContainer';
// carefulReview
import SignIn from '../components/SignIn';
*/

// new generation
import Appbar from '../appbar/Appbar'
import Popup from '../popups/Popup'

import RetrieveAllWords from './AppSupport';

export default function App (props) {

  const [userId, setUserId] = React.useState('');
  const [isDataLoading, setDataLoading] = React.useState(false);
  const [words, setWords] = React.useState([]);
  const [popup, setPopup] = React.useState('');

  const retrieveAllWords = async (givenUserId) => {
    setDataLoading(true);
    const words = await RetrieveAllWords(givenUserId);
    await setWords(words);
    setDataLoading(false);
  }

  return (
    <div>
      <Appbar userId={userId}
              isDataLoading={isDataLoading}
              setDataLoading={setDataLoading}
              setUserId={setUserId}
              setWords={setWords}
              setPopup={setPopup}/>
      {words.length}
      <Popup userId={userId}
             setUserId={setUserId}
             popup={popup}
             setPopup={setPopup}
             retrieveAllWords={retrieveAllWords}/>
    </div>
  );
}

/*
let body = (
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
*/