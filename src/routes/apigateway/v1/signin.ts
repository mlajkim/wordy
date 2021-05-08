import express from 'express';
// Routeres
import requestRefreshtokenThroughGoogle from './signin/requestRefreshtokenThroughGoogle';
import validateRefreshtoken from './signin/validateRefreshtoken';

const signin = express.Router();

signin.use("/request_refreshtoken_through_google/1.0", requestRefreshtokenThroughGoogle);
signin.use("/validate/refreshtoken", validateRefreshtoken);

export default signin;