import express, {Request, Response, NextFunction} from 'express';
import moment from 'moment';
// Routeres
import word from './service/word';

const apigateway = express.Router();

apigateway.use((_req: Request, _res: Response, next: NextFunction) => {
  process.stdout.write(`\n[${moment().format('h:mm a')}] [${moment().format('ddd')}] apigateway \n`);
  next();
});

apigateway.use(word);

export default apigateway;