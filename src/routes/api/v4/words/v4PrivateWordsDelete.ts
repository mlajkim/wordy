import express, { NextFunction, Request, Response } from 'express';
const wordsPrivateDelete = express.Router();
import dotenv from "dotenv";
// Types
import { User } from 'src/typesBackEnd';
// Models
import userSchema from '../../../../models/Users';
// import supportSchema from '../../../../models/Supports';
// import wordSchema from '../../../../models/Words';
// JSON
import response from '../../../../responseStandard.json';
// Payload Type
// type Payload = {
//   deleteTarget: {
//     federalID: string, ederalProvider: string, sem: number
//   }
// };

// Special TOKEN check
wordsPrivateDelete.use("", async (req: Request, res: Response, next: NextFunction) => {
  dotenv.config();
  const INPUT_PRIVATE_ADMIN_KEY = req.headers.privateadminkey;

  if (INPUT_PRIVATE_ADMIN_KEY !== process.env.PRIVATE_ADMIN_KEY as string) {
    const status = 403;
    res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "[FATAL ERROR] PrivateAdminKey Not Provided or Invalid"
    });
  }
  else {
    next();
  }
});

// payload checker
wordsPrivateDelete.use("", async (req: Request, res: Response, next: NextFunction) => {
  const status = 406;
  if (typeof req.body.payload.deleteTarget === 'undefined') 
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "Make sure to have a valid data for deleteTarget payload"
    });
    
  next();
});

// User checker. if user does not existm then it returns fial
wordsPrivateDelete.use("", async (req: Request, res: Response, next: NextFunction) => {
  const { federalProvider, federalID }: User = req.body.payload.deleteTarget;
  const user: User = req.body.userMongo = (await userSchema.findOne({ federalProvider, federalID }))?.toObject();
  if (!user) {
    const status = 404;
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "[FATAL ERROR] The user does not exist"
    });
  };
  
  next();
});

// Fatal Error. The user has to exist. but somehow the DB no longer has it. (HANDLE ERROR)
wordsPrivateDelete.delete("", async (_req: Request, res: Response) => {

  res.send("Success");
});

export default wordsPrivateDelete;

// Valid Payload Type
/**
 * 
{
    "payload": {
        "deleteTarget": {
            "federalProvider": "google", (string)
            "federalID": "1234567890....", (number or string)
            "sen": 202 (number)
        }
    }
}

*/