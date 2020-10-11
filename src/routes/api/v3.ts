import express, {Request, Response, NextFunction} from 'express';
import mongo from './v3/mongo';
import moment from 'moment';

const v3 = express.Router();
v3.use((_req: Request, _res: Response, next: NextFunction) => {
  process.stdout.write(`\n[${moment().format('ddd')}] [${moment().format('h:mm a')}] `);
  next();
});
v3.use('/mongo', mongo);

export default v3;