// Import the necessity
import React from 'react';

// new generation
import Appbar from '../appbar/Appbar'

// import pages //ShowCurrentPage
import ShowCurrentModal from '../modals/ShowCurrentModal';
import ShowCurrentPage from '../pages/ShowCurrentPage';
import Snackbar from '../snackbars/Snackbar';

export default function App () {
  // App Basic Feature (languages.. etc)
  const [isSignedIn, setSignedIn] = React.useState('');

  // User data
  const [profile, setProfile] = React.useState({isSignedIn: false});
  const [words, setWords] = React.useState([]);

  // features
  const [snackbar, setSnackbar] = React.useState({status: 'none'});
  const [modal, setModal] = React.useState({type: 'SignInModal'});
  const [page, setPage] = React.useState('');
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
              setModal={setModal}
              />
      <Snackbar snackbar={snackbar}
                setSnackbar={setSnackbar}/>
      <ShowCurrentModal modal={modal}
                        setModal={setModal}
                        page={page}
                        setPage={setPage}
                        words={words}
                        setWords={setWords}
                        isSignedIn={isSignedIn}
                        setSignedIn={setSignedIn}
                        profile={profile}
                        setProfile={setProfile}
                        setDataLoading={setDataLoading}
                        setSnackbar={setSnackbar}/>
      <ShowCurrentPage page={page}
                       setPage={setPage}
                       words={words}
                       setWords={setWords}
                       isSignedIn={isSignedIn}
                       setSignedIn={setSignedIn}
                       profile={profile}
                       setProfile={setProfile}
                       setDataLoading={setDataLoading}
                       setModal={setModal}
                       setSnackbar={setSnackbar}/>
    </div>
  );
}
