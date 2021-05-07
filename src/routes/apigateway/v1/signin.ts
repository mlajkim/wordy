import express from 'express';
// Routeres
import refreshtoken from './signin/refreshtoken';

const signin = express.Router();

signin.use("/refreshtoken", refreshtoken);

export default signin;