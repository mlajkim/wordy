import express from 'express';
import v4RefreshToken from './auth/v4RefreshToken';

const auth = express.Router();

// Routers Apply
auth.use('/new/refreshToken', v4RefreshToken);


export default auth;