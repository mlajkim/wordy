import express from 'express';
// Routers
import v4RefreshToken from './auth/v4RefreshToken';
import v4AccessToken from './auth/v4AccssToken';
import v4ValidateRefreshToken from './auth/v4ValidateRefreshToken';
import v4SignIn from './auth/v4SignIn';

const auth = express.Router();

// Routers Apply
auth.use('/new/refreshToken', v4RefreshToken);
auth.use('/new/accessToken', v4AccessToken);
auth.use('/validate/refreshToken', v4ValidateRefreshToken);
auth.use('/signIn', v4SignIn);


export default auth;