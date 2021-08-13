import express from 'express';
// library
import { watGateway } from '../internal/security/wat';
// Routeres
import word from './service/word';
import user from './service/user';
import okr from './service/okr';
import wp from './service/wp';

const apigateway = express.Router();

// This is old idea as CloudTrailGateway will eventually handle
/*
apigateway.use((req: Request, _res: Response, next: NextFunction) => {
  const RE = req.body as WordyEvent;
  process.stdout.write(`\n[${moment().format('h:mm a')}] [${moment().format('ddd')}] ${RE.eventType} `);
  next();
});
*/

// Here, apigateway first reads the httponly accessToken. 
// if token does not exist, it just saves the default value wrn:::::::
apigateway.use(watGateway);

// Apply
apigateway.use(word);
apigateway.use(user);
apigateway.use(okr);
apigateway.use(wp);


// Finally
export default apigateway;