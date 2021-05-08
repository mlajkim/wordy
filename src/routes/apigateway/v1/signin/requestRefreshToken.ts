import express, { Request, Response, NextFunction } from 'express';
import { connectToMongoDB } from '../../../../internal/mongo';
// Shared
import { RequestRefreshTokenPayload_V1 } from '../../../../type/payloadType';
import { validateGoogleSigninToken } from '../../../../internal/backendWambda';

const generateRefreshToken = express.Router();

// Connects to MDB for checking
generateRefreshToken.use(connectToMongoDB);

generateRefreshToken.post("/1.0", async (req: Request, res: Response, next: NextFunction) => {
  const payload: RequestRefreshTokenPayload_V1 = req.body.payload;
  console.log(payload); // testing

  // This is abosolute origin for allowed
  switch (payload.federalProvider) {
    case 'google':
      if (validateGoogleSigninToken(payload.federalAuthorizationToken))
        next();
      break;
    
    case 'anonymous':
      // Currently does not support anonymous and therefore will respond fail
      // next();
      break;

    default:
      return res.send("error");
  };

  // Send error if it fails the test
  return res.send("error");
});

generateRefreshToken.post("/1.0", async (req: Request, res: Response) => {
  const payload = req.body.payload;
  console.log(payload);
  res.send("Hello Event Driven Arch. World!")
});

export default generateRefreshToken;