// Main
import express, {  NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
// type
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { MyOkrPure, OkrContainerPure } from '../../../type/resourceType';
// internal
import { getToday, getNow } from '../../../internal/compute/backendWambda';
import { ctGateway } from '../../../internal/management/cloudTrail';
import { generatedWrn, intoResource, convertQuarterlyIntoMoment } from '../../../internal/compute/backendWambda';
import { CreateMyOkrUserNameRule } from '../../../type/sharedWambda';
// Mogno DB
import { MyOkrModel, ContainerModel, ResCheck } from '../../../models/EncryptedResource';
// Gateway
import { iamGateway } from '../../../internal/security/iam';
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE = "okr:createMyOkr";
const SERVICE_NAME: EventType = `${EVENT_TYPE}`
dotenv.config();

const LIMIT = 1000 * 60 * 60 * 24 * 14; // 14 days after
const getNextQuarterly = () => {
  const { quarterly } = getToday(getNow() + LIMIT);
  return quarterly;
}

router.use(async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const requestedEvent = req.body as WordyEvent; // receives the event
  if (requestedEvent.serverResponse === "Denied") {
    ctGateway(requestedEvent, "Denied");
    return res.status(requestedEvent.status!).send(requestedEvent);
  }

  // Validation with IAM
  const iamValidatedEvent = iamGateway(requestedEvent, "wrn::wp:pre_defined:backend:only_to_wordy_member:210811"); // validate with iamGateway
  if (iamValidatedEvent.serverResponse === 'Denied'){
    ctGateway(requestedEvent, "Denied");
    return res.status(requestedEvent.status!).send(requestedEvent);
  }

  // Validation complete
  req.body = iamValidatedEvent;
  next();
}); 

// connects into mongodb
router.use(connectToMongoDB);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare requested event
  const RE = req.body as WordyEvent; // receives the event

  // Record
  RE.validatedBy 
    ? RE.validatedBy.push(SERVICE_NAME) 
    : RE.validatedBy = [SERVICE_NAME];

  // validation of user input with name
  const userNicknameInput = RE.requesterInputData as string;
  if (CreateMyOkrUserNameRule(userNicknameInput) === "NotPassed") {
    ctGateway(RE, "LogicallyDenied");
    return res.status(RE.status!).send(RE);
  }

  // if my okr exists, it should reject, as it shouldh ave only one
  const data = await MyOkrModel.findOne({ ownerWrn: RE.requesterWrn }); // returns null when not found
  if (data) {
    ctGateway(RE, "LogicallyDenied", "Already exists");
    return res.status(RE.status!).send(RE);
  };

  // Set up container too
  const quarterly = getNextQuarterly();
  const quarterlyContainerWrn = generatedWrn(`wrn::okr:container:mdb:${quarterly}:`);
  const newContainer: OkrContainerPure = {
    containerType: "quarterly",
    from: getNow(),
    until: convertQuarterlyIntoMoment(quarterly)
  }
  const newContainerResource = intoResource(newContainer, quarterlyContainerWrn, RE, "wrn::wp:pre_defined:backend:dangerously_public:210811"); //testing

  // Data declration with generated Wrn
  const wrn = generatedWrn("wrn::okr:my_okr:mdb::");
  const newMyOkr: MyOkrPure = {
    id: `go${RE.requesterInfo!.federalId}`, // for now, no customizing
    name: userNicknameInput, // for now, no customizing
    whichOneDownloadFirst: quarterlyContainerWrn,
    quarterlyContainers: [quarterlyContainerWrn], // default
    yearlyContainers: [],
    longtermContainers: [],
    joinedGroup: []
  };
  const newMyOkrResource = intoResource(newMyOkr, wrn, RE, "wrn::wp:pre_defined:backend:dangerously_public:210811"); // testing purpose, will be wordyMember only

  // Returning data
  await new MyOkrModel(ResCheck(newMyOkrResource)).save()
    .then(async () => {
      // quickly saves container.
      const isContainerAdded = await new ContainerModel(ResCheck(newContainerResource)).save();
      if (!isContainerAdded) {
        ctGateway(RE, "LogicallyDenied", "Failed during saving Container Resource");
        return res.status(RE.status!).send(RE)
      };

      RE.payload = newMyOkr;
      ctGateway(RE, "Accepted");
      return res.status(RE.status!).send(RE);
    })
    .catch(() => {
      ctGateway(RE, "LogicallyDenied", "Failed during saving newMyOkr Resource");
      return res.status(RE.status!).send(RE)
    });
});

export default router;