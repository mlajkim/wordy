// Import the necessity
import React from 'react';

// new generation
import Appbar from '../appbar/Appbar'

// import pages //ShowCurrentPage
import ShowCurrentPage from '../pages/ShowCurrentPage';

export default function App () {
  // App Basic Feature (languages.. etc)
  const [isSignedIn, setSignedIn] = React.useState('');

  // User data
  const [profile, setProfile] = React.useState({});
  const [words, setWords] = React.useState([]);

  // features
  const [page, setPage] = React.useState('welcome');
  const [isDataLoading, setDataLoading] = React.useState(false);

  return (
    <div>
      <Appbar setPage={setPage}
              isDataLoading={isDataLoading}
              setDataLoading={setDataLoading}
              setWords={setWords}
              isSignedIn={isSignedIn}
              setSignedIn={setSignedIn}
              profile={profile}
              />
      <ShowCurrentPage page={page}
                       setPage={setPage}
                       words={words}
                       setWords={setWords}
                       isSignedIn={isSignedIn}
                       setSignedIn={setSignedIn}
                       profile={profile}
                       setProfile={setProfile}
                       setDataLoading={setDataLoading}/>
    </div>
  );
}
