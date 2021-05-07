import express from 'express';
// Routeres
import signin from './v1/signin';

const v1 = express.Router();

v1.use("/signin", signin);



export default v1;