import express from 'express';
// Routeres
import generateRefreshtoken from './refreshtoken/generateRefreshtoken';

const refreshtoken = express.Router();

refreshtoken.use("/generate", generateRefreshtoken);

export default refreshtoken;