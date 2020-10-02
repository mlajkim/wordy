import axios from 'axios';

type GoogleRes = {
  googleId: string;
  profileObj: {
    familyName: string;
    givenName: string;
    email: string;
    imageUrl: string;
  }
};

type UsersRes = {
  status: 200 | 204;
  message: string;
  user: User;
};

type User = {
  federalProvider: string;
  federalID: string,
  lastName: string,
  firstName: string,
  email: string,
  imageUrl: string
};

const handleNonExistingUsser = (accessToken: string) => {
  // create user
  console.log(accessToken)
  axios.post(`/api/v2/mongo/users`, null, {
    headers: {Authorization: `Bearer ${accessToken}`}
  })
};

// @MAIN
export const handleSignIn = async ({googleId, profileObj}: GoogleRes) => {
  // Get access token & Refresh token
  const data = (await axios.post(`/api/v2/auth/login`, {
    federalProvider: 'google',
    federalID: googleId,
    lastName: profileObj.familyName,
    firstName: profileObj.givenName,
    email: profileObj.email,
    imageUrl: profileObj.imageUrl
  })).data;

  // Save token securely


  // Fetch meanwhile
  axios.get(`/api/v2/mongo/users`, {
    headers: {Authorization: `Bearer ${data.accessToken}`}
  }).then(res => {
    console.log(res);
    if(res.status === 204) {
      // not found
      handleNonExistingUsser(data.accessToken);
    }
  })
};

