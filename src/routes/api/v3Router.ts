import express, {Request, Response, NextFunction} from 'express';
import mongo from './v3/mongoRouter';
import moment from 'moment';

const v3Router = express.Router();
v3Router.use((_req: Request, _res: Response, next: NextFunction) => {
  process.stdout.write(`\n[${moment().format('ddd')}] [${moment().format('h:mm a')}] `);
  next();
});
v3Router.use('/mongo', mongo);


export default v3Router;