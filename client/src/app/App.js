// Import the necessity
import React from 'react';

// new generation
import Appbar from './Appbar'

// import pages //ShowCurrentPage
import ShowCurrentModal from '../modals/ShowCurrentModal';
import ShowCurrentPage from '../pages/ShowCurrentPage';
import Snackbar from '../snackbars/Snackbar';

export default function App () {
  // User data
  const [profile, setProfile] = React.useState({isSignedIn: false});
  const [words, setWords] = React.useState([]);

  // features
  const [page, setPage] = React.useState('');
  const [modal, setModal] = React.useState({type: 'SignInModal'}); // SignInModal
  const [snackbar, setSnackbar] = React.useState({status: 'none'});
  const [isDataLoading, setDataLoading] = React.useState(false);

  return (
    <div>
      <Appbar
        profile={profile}
        isDataLoading={isDataLoading} 
        setPage={setPage}
        setWords={setWords}
        setDataLoading={setDataLoading}
        setModal={setModal}
      />
      <Snackbar 
        snackbar={snackbar}
        setSnackbar={setSnackbar}
      />
      <ShowCurrentModal 
        words={words}
        page={page}
        modal={modal}
        setModal={setModal}
        setPage={setPage}
        setWords={setWords}
        profile={profile}
        setProfile={setProfile}
        setDataLoading={setDataLoading}
        setSnackbar={setSnackbar}
      />
      <ShowCurrentPage 
        page={page}
        setPage={setPage}
        words={words}
        setWords={setWords}
        profile={profile}
        setProfile={setProfile}
        setDataLoading={setDataLoading}
        setModal={setModal}
        setSnackbar={setSnackbar}
      />
    </div>
  );
}
