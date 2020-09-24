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

  const props = {
    profile, words, isSandbox, page, modal, snackbar, isDataLoading,
    setProfile, setWords, setSandbox, setPage, setModal, setSnackbar, setDataLoading
  }

  return (
    <div>
      <Appbar {... props} />
      <Snackbar {... props} />
      <ShowCurrentModal {... props} />
      <ShowCurrentPage {... props} />
    </div>
  );
}
