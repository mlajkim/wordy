import express, {Request, Response, NextFunction} from 'express';
import moment from 'moment';
// library
import { watGateway } from '../internal/security/wat';
// Routeres
import word from './service/word';
import user from './service/user';

const apigateway = express.Router();

apigateway.use((_req: Request, _res: Response, next: NextFunction) => {
  process.stdout.write(`\n[${moment().format('h:mm a')}] [${moment().format('ddd')}] apigateway \n`);
  next();
});

// Here, apigateway first reads the httponly accessToken. 
// if token does not exist, it just saves the default value wrn:::::::
apigateway.use(watGateway);

// Apply
apigateway.use(word);
apigateway.use(user);

// Finally
export default apigateway;