// Import the necessity
import React, {useState} from 'react';

// new generation
import Appbar from './Appbar'

// import pages //ShowCurrentPage
import ShowCurrentModal from '../modals/ShowCurrentModal';
import ShowCurrentPage from '../pages/ShowCurrentPage';
import Snackbar from '../snackbars/Snackbar';

export default function App () {
  // User data
  const [profile, setProfile] = useState({isSignedIn: false});
  const [words, setWords] = useState([]);

  // Finance related
  const [isSandbox, setSandbox] = useState(true); // ALWAYS FALSE FOR ACTUAL PAYPAL PAYMENT

  // features
  const [page, setPage] = useState('');
  const [modal, setModal] = useState({type: 'SignInModal'}); // SignInModal
  const [snackbar, setSnackbar] = useState({status: 'none'});
  const [isDataLoading, setDataLoading] = useState(false);

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
        profile={profile}
        words={words}
        isSandbox={isSandbox}
        page={page}
        setWords={setWords}
        setSandbox={setSandbox}
        setProfile={setProfile}
        setPage={setPage}
        setModal={setModal}
        setSnackbar={setSnackbar}
        setDataLoading={setDataLoading}
      />
    </div>
  );
}
