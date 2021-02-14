import express, {Request, Response} from 'express';
import supportSchema from '../../../../models/Supports';
const supports = express.Router();

const DefaultValue = { sems: [], newWordCnt: 0, deletedWordCnt: 0, isDarkMode: false };

// @ CREATE
supports.post("/:ownerID", async (req: Request, res: Response) => {
  const ownerID = req.params.ownerID;
  const newSupport = await new supportSchema({
    ownerID,
    ...DefaultValue,
  }).save();
  res.send({ empty: false, length: 1, data: newSupport })
});

// @ READ
supports.get("/:ownerID", async (req: Request, res: Response) => {
  const ownerID = req.params.ownerID;
  const support = await supportSchema.findOne({ownerID})
  res.send({
    empty: support === null ? true : false, // null is considred not empty
    length: support === null ? 0 : 1,
    data: support
  })
});

// @ UPDATE
supports.put("/:ownerID", async (req: Request, res: Response) => {
  const {ownerID, payload} = req.body;
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