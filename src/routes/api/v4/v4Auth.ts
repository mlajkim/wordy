import express from 'express';
// Routers
import v4RefreshToken from './auth/v4RefreshToken';
import v4AccessToken from './auth/v4AccssToken';

const auth = express.Router();

// Routers Apply
auth.use('/new/refreshToken', v4RefreshToken);
auth.use('/new/accessToken', v4AccessToken);


export default auth;