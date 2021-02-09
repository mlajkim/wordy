import express, {Request, Response, NextFunction} from 'express';
import moment from 'moment';
// Routeres
import v2 from './api/v2';
import v3Router from './api/v3Router';
import v4Router from './api/v4Router';

const api = express.Router();

api.use((_req: Request, _res: Response, next: NextFunction) => {
  const symbol = parseInt(moment().format('mm')) % 2 === 0 ? '✨': '🐠';
  process.stdout.write(`\n[${symbol}] [${moment().format('ddd')}] [${moment().format('h:mm a')}] `);
  next();
});

api.use("/v2", v2);
api.use("/v3", v3Router);
api.use("/v4", v4Router);

export default api;