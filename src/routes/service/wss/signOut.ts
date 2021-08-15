// Main
import express, {   Request, Response } from 'express';
// Type
import { HttpOnlyCookie } from '../../../type/availableType';
import { pathFinder, EventType, WordyEvent } from '../../../type/wordyEventType';
// Middleware
import { openToPublic, addValidatedByThisService } from '../../middleware/onlyToMdl';
// internal
import { ctGateway } from '../../../internal/management/cloudTrail';
// Gateway
import { connectToMongoDB } from '../../../internal/database/mongo';
// Router
const router = express.Router();
const EVENT_TYPE: EventType = "wss:signOut";

// Who can use this router? Connects to MongoDB?
router.use(openToPublic); 
router.use(connectToMongoDB);
router.use(addValidatedByThisService);

router.post(pathFinder(EVENT_TYPE), async (req: Request, res: Response) => {
  // DECLARE
  const RE = req.body as WordyEvent;
  const deletingCookieName: HttpOnlyCookie = "WordyAccessToken";

  // there is no logic for killing cookie. and therefore will just do the following;
  const sending = ctGateway(RE, "Accepted");
  res.clearCookie(deletingCookieName).status(sending.status!).send(sending);
});

export default router;