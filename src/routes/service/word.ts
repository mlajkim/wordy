// Main
import express, { Request, Response } from 'express';
import { pathFinder } from '../../type/wordyEventType';
// type
import { Policy } from '../../typesBackEnd';
// Gateway
import { iamGateway } from '../../internal/security/iam';
// Router
const word = express.Router();

word.post(pathFinder("word:detectLanguage"), async (req: Request, res: Response) => {
  const policy: Policy = {
    version: "1.0.210729",
    comment: "Allow only kim for any action",
    statement: {
      effect: "Allow",
      principal: "wrn::user:admin:mdb:00001111",
      action: "*", 
    }
  };

  const requestedEvent = req.body; // receives the event
  
  const iamValidatedEvent = iamGateway(requestedEvent, policy); // validate with iamGateway
  console.log(iamValidatedEvent) // test

  res.send(iamValidatedEvent);
});

export default word;