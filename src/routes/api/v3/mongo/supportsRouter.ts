import express, {NextFunction, Request, Response} from 'express';
import supportSchema from '../../../../models/Supports';
const supports = express.Router();

const DefaultValue = {sems: [], newWordCnt: 0, deletedWordCnt: 0};

// @ LOGGER
const ROUTER_NAME = 'Support';
supports.use('', (req: Request, _res: Response, next: NextFunction) => {
  process.stdout.write(`${ROUTER_NAME} `);
  req.body.ownerID = req.params.ownerID;
  next();
})
const logger = (data: string) => console.log(data + "...");

// @ CREATE
supports.post("", async (req: Request, res: Response) => {
  const {ownerID} = req.body;
  logger('Creating Default');
  await new supportSchema({
    ownerID,
    ...DefaultValue
  });
  
  res.send({ empty: true })
});

// @ READ
supports.get("", async (req: Request, res: Response) => {
  const ownerID = req.body.ownerID;
  logger('Attempting to get data');
  supportSchema.find({ownerID})
  .then(data => res.send({
    status: 200,
    message: `[OK]`,
    empty: data.length === 0 ? true : false,
    length: data.length,
    data
  }))
  .catch(err => res.status(404).send({
    status: 404,
    message: `[FAIL] ${err}`,
    empty: true
  }))
});

// @ UPDATE
supports.put("", async (req: Request, res: Response) => {
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
supports.delete("/:targetID", async (_req: Request, _res: Response) => {

});

export default supports;