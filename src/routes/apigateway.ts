import express, {Request, Response, NextFunction} from 'express';
import moment from 'moment';
// Routeres
import word from './service/word';

const apigateway = express.Router();

apigateway.use((_req: Request, _res: Response, next: NextFunction) => {
  const symbol = parseInt(moment().format('mm')) % 2 === 0 ? '✨': '🐠';
  process.stdout.write(`\n[APIGATEWAY] [${symbol}] [${moment().format('ddd')}] [${moment().format('h:mm a')}] `);
  next();
});

apigateway.use(word);

export default apigateway;