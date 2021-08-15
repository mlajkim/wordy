// Main
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// type
import { Wrn } from '../../../type/availableType';
import lec from '../../../type/LogicalErrorCode.json';
import { CreateOkrObjectInput, CreateOkrObjectPayload } from '../../../type/payloadType'
import { pathFinder, WordyEvent, EventType } from '../../../type/wordyEventType';
import { OkrObjectPure, OkrContainerPure, ResourceId } from '../../../type/resourceType';
import { pushDataEvenUndefined, sln } from '../../../type/sharedWambda';
// Mogno DB
import { OkrObjectModel, ResCheck, ContainerModel } from '../../../models/EncryptedResource';
// Mdl
import { onlyToWordyMemberMdl, addValidatedByThisService } from '../../middleware/onlyToMdl';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
import { generatedWrn, intoResource, getNow, intoPayload } from '../../../internal/compute/backendWambda';
// Gateway
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "okr:createOkrObject";
dotenv.config();
const MODIFABLE_AFTER = 1000 * 60 * 60 * 24 * 14; // 2 weeks

// Only available to Wordy Members
router.use(onlyToWordyMemberMdl); 
router.use(connectToMongoDB);
router.use(addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // declare requested event & write it down with validation 
  const RE = req.body as WordyEvent; // receives the event
  const { type, title, associateContainerWrn } = RE.requesterInputData as CreateOkrObjectInput;
  title.trim();

  // First, prepare okr object data.
  const okrObjectWrn: Wrn = generatedWrn(`wrn::okr:okr_object:mdb:${type}:`);
  const newMyOkr: OkrObjectPure = { type, title, isDataSatisfied: "NotSatisfied" }; // NotSatisfied by default
  const newMyOkrResource = intoResource(newMyOkr, okrObjectWrn, RE, "wrn::wp:pre_defined:backend:only_owner:210811", undefined, getNow() + MODIFABLE_AFTER);

  // Before creating the okr object, the container first must allow 
  // if it is addable or not. so it checks here following
  // this line of code rejects if not satisfied. and modify, and finally prepare for E/R (Encrypted Reosurce)
  const foundContainer = await ContainerModel.findOne({ wrn: associateContainerWrn })
  
  if (foundContainer && foundContainer.ownerWrn !== RE.requesterWrn) {
    const sending = ctGateway(RE, "LogicallyDenied", lec.NO_PERMISSION_TO_PERFORM_SUCH_ACTION[sln(RE)]);
    return res.status(sending.status!).send(sending);
  };

  // check if container is belong to requester
  if (!foundContainer) {
    const sending = ctGateway(RE, "LogicallyDenied", lec.RESOURCE_NOT_EXIST[sln(RE)]);
    return res.status(sending.status!).send(sending);
  };

  const pureContainerRes = intoPayload(foundContainer, RE) as ResourceId & OkrContainerPure;
  if (pureContainerRes.addableUntil < getNow()) {
    const sending = ctGateway(RE, "LogicallyDenied", lec.NO_LONGER_ADDABLE_TO_THE_CONTAINER);
    return res.status(sending.status!).send(sending);
  };
  pureContainerRes.containingObject = pushDataEvenUndefined(okrObjectWrn, pureContainerRes.containingObject);
  const modifiedContainerRes = intoResource(pureContainerRes, pureContainerRes.wrn, RE, pureContainerRes.wpWrn);

  // Finally save and respond
  await new OkrObjectModel(ResCheck(newMyOkrResource)).save()
    .then(async () => {
      await ContainerModel.findOneAndUpdate({ wrn: pureContainerRes.wrn }, ResCheck(modifiedContainerRes))
        .then(() => {
          RE.payload = pureContainerRes as CreateOkrObjectPayload;
          const sending = ctGateway(RE, "Accepted");
          return res.status(sending.status!).send(sending) })
        .catch(() => {
          const sending = ctGateway(RE, "LogicallyDenied", lec.FAILED_TO_MODIFY_FOLLOWING_MODEL_DUE_TO_DB_FAILURE + "ContainerModel");
          return res.status(sending.status!).send(sending) });
    })
    .catch(() => {
      const sending = ctGateway(RE, "LogicallyDenied", lec.FAILED_TO_SAVE_FOLLOWING_MODEL_DUE_TO_DB_FAILURE + "OkrObjectModel");
      return res.status(sending.status!).send(sending)
    });
});

export default router;