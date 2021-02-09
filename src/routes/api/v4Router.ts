import express, {Request, Response, NextFunction} from 'express';
import moment from 'moment';
// Routers
import v4Auth from './v4/v4Auth';
import v4Mongo from './v4/v4Mongo';

const v4Router = express.Router();
v4Router.use((_req: Request, _res: Response, next: NextFunction) => {
  process.stdout.write(`\n[${moment().format('ddd')}] [${moment().format('h:mm a')}] `);
  next();
});

// Routers Apply
v4Router.use('/auth', v4Auth);
v4Router.use('/mongo', v4Mongo);

// Private Routers '/private/mongo'


export default v4Router;