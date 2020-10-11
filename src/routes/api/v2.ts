import express from 'express';
import auth from './v2/auth';
import mongo from './v2/mongo';
import ip from './v2/ip';

const v2 = express.Router();

v2.use('/ip', ip);
v2.use('/auth', auth);
v2.use('/mongo', mongo);

export default v2;