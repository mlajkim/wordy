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

// import pages //ShowCurrentPage
import ShowCurrentPage from '../pages/ShowCurrentPage';

export default function App (props) {
  // App Basic Feature (languages.. etc)
  const [isSignedIn, setSignedIn] = React.useState('');

  // User data
  const [profile, setProfile] = React.useState({});
  const [words, setWords] = React.useState([]);

  // features
  const [page, setPage] = React.useState('welcome');
  const [isDataLoading, setDataLoading] = React.useState(false);
  const [popup, setPopup] = React.useState('');

  const retrieveAllWords = async (givenUserId) => {
    setDataLoading(true);
    const words = await RetrieveAllWords(givenUserId);
    await setWords(words);
    setDataLoading(false);
  }

  return (
    <div>
      <Appbar setPage={setPage}
              isDataLoading={isDataLoading}
              setDataLoading={setDataLoading}
              setWords={setWords}
              setPopup={setPopup}
              isSignedIn={isSignedIn}
              setSignedIn={setSignedIn}
              profile={profile}
              />
      <Popup popup={popup}
             setPopup={setPopup}
             retrieveAllWords={retrieveAllWords}/>
      <ShowCurrentPage page={page}
                       setPage={setPage}
                       words={words}
                       isSignedIn={isSignedIn}
                       setSignedIn={setSignedIn}
                       setWords={setWords}
                       profile={profile}
                       setProfile={setProfile}
                       setDataLoading={setDataLoading}/>
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