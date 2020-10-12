import express, {NextFunction, Request, Response} from 'express';
import supportSchema from '../../../../models/Supports';
const supports = express.Router();

const DefaultValue = {sems: [], newWordCnt: 0, deletedWordCnt: 0};

// @ LOGGER
const ROUTER_NAME = 'Support Router';
supports.use('', (_req: Request, _res: Response, next: NextFunction) => {
  process.stdout.write(`[${ROUTER_NAME}] `);
  next();
})
const logger = (data: string) => console.log(data + "...");

// @ CREATE
supports.post("/:ownerID", async (req: Request, res: Response) => {
  const ownerID = req.params.ownerID;
  console.log('wtf', ownerID)
  const newSupport = await new supportSchema({
    ownerID,
    ...DefaultValue,
  }).save();
  logger(`Creating default... ${newSupport}`);
  res.send({ empty: true })
});

// @ READ
supports.get("/:ownerID", async (req: Request, res: Response) => {
  const ownerID = req.body.ownerID;
  const support = await supportSchema.findOne({ownerID})
  logger(`Found ${support}`);
  res.send({
    empty: support === null ? true : false, // null is considred not empty
    length: support === null ? 0 : 1,
    data: support
  })
});

// @ UPDATE
supports.put("/:ownerID", async (req: Request, res: Response) => {
  const {ownerID, payload} = req.body;
  console.log(`Attempting to modify data...`);
  supportSchema.findOneAndUpdate({ownerID}, payload[0], {useFindAndModify: false})
  .then(_resp => res.send({
    status:200,
    message: `[OK]`
  }))
  .catch(err => res.status(404).send({
    status: 404,
    message: `[FAIL] ${err}`
  }))
});

// @ DELETE
supports.delete("/:ownerID/:targetID", async (_req: Request, _res: Response) => {

});

export default supports;