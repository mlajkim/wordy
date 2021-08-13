// Main
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// type
import { Wrn } from '../../../type/availableType';
import { CreateOkrObjectInput } from '../../../type/payloadType'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
// Mogno DB
import { OkrObjectModel } from '../../../models/EncryptedResource';
// Mdl
import { onlyToWordyMemberMdl } from '../../middleware/onlyToMdl';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { generatedWrn, intoResource, getToday } from '../../../internal/compute/backendWambda';
// Library
import moment from 'moment';

// Gateway
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "okr:createOkrObject";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

// Only available to Wordy Members
router.use(onlyToWordyMemberMdl); 

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare requested event & write it down with validation 
  const RE = req.body as WordyEvent; // receives the event
  const inputData = RE.requesterInputData as CreateOkrObjectInput;
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME];

  // get a good public id
  let publicId = "";
  const { year, sem } = getToday();
  if (inputData.type === "Objective") publicId = year.toString();
  else if (inputData.type === "KeyResult") publicId = sem.toString();
  else if (inputData.type === "OkrDailyRoutine") publicId = `100${sem.toString()}`;

  // Cleaning the data before using it
  inputData.title.trim();

  // Data declration with generated Wrn
  const wrn: Wrn = generatedWrn(`wrn::okr:okr_object:mdb:${publicId}:`);
  const newMyOkr = { ...inputData, okrObjectOrder: moment().valueOf() };
  const newMyOkrResource = intoResource(newMyOkr, wrn, RE);

  // Returning data
  await new OkrObjectModel(newMyOkrResource).save()
    .then(() => {
      ctGateway(RE, "Accepted");
      return res.status(RE.status!).send(RE);
    })
    .catch(() => {
      ctGateway(RE, "LogicallyDenied", "Somehow failed to save DB data");
      return res.status(RE.status!).send(RE)
    });
});

export default router;