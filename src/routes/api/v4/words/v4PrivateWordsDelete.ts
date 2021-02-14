import express, { NextFunction, Request, Response } from 'express';
const wordsPrivateDelete = express.Router();
import dotenv from "dotenv";
// Types
import { Support, User } from 'src/typesBackEnd';
// Models
import userSchema from '../../../../models/Users';
import supportSchema from '../../../../models/Supports';
import wordSchema from '../../../../models/Words';
// JSON
import response from '../../../../responseStandard.json';
// Payload Type
type DeleteTarget = {
  federalID: string, federalProvider: string, sem: number
};

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
  const { federalProvider, federalID }: DeleteTarget = req.body.payload.deleteTarget;
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

wordsPrivateDelete.use("", async (req: Request, res: Response, next: NextFunction) => {
  const { sem }: DeleteTarget = req.body.payload.deleteTarget;

  const foundLength = req.body.foundLength = (await wordSchema.find({ ownerID: req.body.userMongo._id , sem })).length;

  const status = 404
  if (foundLength === 0) 
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "Unable to find a single word with given federalProvider, federalID and sem"
    });

  next();
});

// Fatal Error. The user has to exist. but somehow the DB no longer has it. (HANDLE ERROR)
wordsPrivateDelete.delete("", async (req: Request, res: Response) => {
  const ownerID = req.body.userMongo._id;
  const { sem }: DeleteTarget = req.body.payload.deleteTarget;
  const { deletedWordCnt, sems }: Support = (await supportSchema.findOne({ ownerID }))?.toObject();

  // Remove the sem from sems
  const idxOfSem = sems.indexOf(sem);
  sems.splice(idxOfSem, 1);
  
  // Apply new deleted word count
  const newDeletedWordCnt = deletedWordCnt + req.body.foundLength;
  await supportSchema.findOneAndUpdate({ ownerID }, { 
    deletedWordCnt: newDeletedWordCnt, sems  
  }, {useFindAndModify: false});

  // Deletes the actual words data.
  await wordSchema.deleteMany({ ownerID, sem });

  // Finally, return.
  const status = 200;
  return res.status(status).send({
    status: response[status].status,
    message: response[status].message,
    details: req.body.foundLength === 1 ? "Sucessfully deleted 1 word" : `Sucessfully deleted ${req.body.foundLength} words`
  });
}); // end


export default wordsPrivateDelete;