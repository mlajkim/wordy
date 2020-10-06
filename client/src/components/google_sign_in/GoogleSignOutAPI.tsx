import {useGoogleLogout} from 'react-google-login'
import {GOOGLE_CLIENT_ID} from '../../credential';
import * as API from '../../API';
// Redux
import store from '../../redux/store';
import {setSignedIn, setDialog, setPage} from '../../redux/actions';

const handleSuccessfulSignOut = () => {
  API.killCookie('login');
  store.dispatch(setSignedIn(false));
  store.dispatch(setDialog(''));
  store.dispatch(setPage('home'));
};

const handleLogoutFailure = () => {

};

// @Main
const GoogleSignOutAPI = () => {
  const { signOut } = useGoogleLogout({
    onFailure: handleLogoutFailure,
    clientId: GOOGLE_CLIENT_ID,
    onLogoutSuccess: handleSuccessfulSignOut
  })
  
  signOut();
};

export default GoogleSignOutAPI;
