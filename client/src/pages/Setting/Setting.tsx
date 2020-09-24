// eslint-disable-next-line
import React, {useEffect} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
// icon
import SettingsIcon from '@material-ui/icons/Settings';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import WhatshotIcon from '@material-ui/icons/Whatshot';
// Components
import AdvanceSetting from './AdvancedSetting';
import GoogleSignOut from'../../components/sign_in/GoogleSignOut';
// utils
import { Props } from '../../utils';

const Setting: React.FC<Props> = (props) => {
  const sandbox = props.isSandbox ? 'sandbox' : 'live';
  const profile = props.profile;

  useEffect(() => {
    const getPaypalDetails = async() => {
      // Get the user data first from database
      let endpoint = `/api/mongo/user/get/withID/${props.profile.UNIQUE_ID}`;
      const userRes = await (await fetch(endpoint)).json();

      // Get the transaction
      endpoint = `/api/mongo/transaction/get/withID/${userRes.data.lastTransactionID}`;
      const transactionRes = await (await fetch(endpoint)).json();
      if (transactionRes.status === 'null') return; // if empty

      // Get the access token
      const accessTokenResponse = await (await fetch(`/api/paypal/access_token/get/${sandbox}`)).json()

      // Get the paypal response from backend
      endpoint = `/api/paypal/sub/get/sub_detail/with_subID_and_token/${transactionRes.data.subscriptionID}/${accessTokenResponse.data}/${sandbox}`;
      const paypalSubDetailResponse = await(await fetch(endpoint)).json();

      // change the front end
      let newProfile = props.profile;
      let subInfo = {
        hasData: true,
        isActive: paypalSubDetailResponse.status === 'ACTIVE' ? true : false,
        nextBillingDate: paypalSubDetailResponse.status === 'ACTIVE' ? paypalSubDetailResponse.billing_info.next_billing_time : null
      };
      newProfile.subInfo = subInfo;
      return newProfile;
    }
    getPaypalDetails().then(res => props.setProfile(res));

    
  }, [props, props.profile, sandbox])

  let handle_next_payment;
  if(profile.subInfo.hasData && profile.subInfo.isActive) {
    handle_next_payment = (
      <h4>Next Payment Date: {profile.subInfo.nextBillingDate}</h4>
    );
  }
  else handle_next_payment = null;

  return (
    <div>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md">
          <Grid container direction="row">
            <SettingsIcon style={{ fontSize: 30, marginTop: 15, marginBottom: 25 }}/>
            <h3 style={{ marginTop: 15, marginBottom: 20 }}>Setting</h3>
          </Grid>
          <Grid container direction="row" style={{ marginBottom: 8}}>
            <Avatar
              style={{marginTop: 9}} 
              alt={`${profile.userInfo.familyName} ${profile.userInfo.givenName}`} 
              src={profile.userInfo.profileImgUrl}
            />
            <h4 style={{marginRight: 8, marginLeft: 15}}>
              {profile.userInfo.givenName} {profile.userInfo.familyName}
            </h4>
            <p style={{marginTop: 19}}>(Syncing to {profile.userInfo.email})</p>
          </Grid>
          <GoogleSignOut {... props}/>
          <Grid container direction="row" style={{ marginBottom: 5}}>
            <FavoriteOutlinedIcon style={{ fontSize: 25, marginTop: 20}}/>
            <h4 style={{ marginTop: 22, marginRight: 7 }}> Subscription Status: </h4>
            {profile.userInfo.subscription === 'Pro' && 
            <WhatshotIcon style={{ fontSize: 30, marginTop: 15, color: 'Red' }} />}
            <h3 style={{ marginTop: 20 }}>{profile.userInfo.subscription} Member</h3>
          </Grid>
          <Grid container direction="row" style={{marginBottom: 25, marginLeft: 23}}>
            {handle_next_payment}
          </Grid>
          <AdvanceSetting {... props} />
        </Container>
      </React.Fragment>
    </div>
  );
}

export default Setting;