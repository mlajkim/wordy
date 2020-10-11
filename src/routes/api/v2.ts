import express, {Request, Response, NextFunction} from 'express';
import auth from './v2/auth';
import mongo from './v2/mongo';
import ip from './v2/ip';
import moment from 'moment';

const v2 = express.Router();
v2.use((_req: Request, _res: Response, next: NextFunction) => {
  const symbol = parseInt(moment().format('mm')) % 2 === 0 ? '✨': '🐠';
  process.stdout.write(`\n[${symbol}] [${moment().format('ddd')}] [${moment().format('h:mm a')}] `);
  next();
});
v2.use('/ip', ip);
v2.use('/auth', auth);
v2.use('/mongo', mongo);

export default v2;