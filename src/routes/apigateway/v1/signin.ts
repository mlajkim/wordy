import express from 'express';
// Routeres
import requestRefreshtoken from './signin/requestRefreshtoken';
import validateRefreshtoken from './signin/validateRefreshtoken';

const signin = express.Router();

signin.use("/request/refreshtoken", requestRefreshtoken);
signin.use("/validate/refreshtoken", validateRefreshtoken);

export default signin;