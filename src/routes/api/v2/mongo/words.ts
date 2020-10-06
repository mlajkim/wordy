import express, {Request, Response} from 'express';
import wordSchema from '../../../../models/Words';

const words = express.Router();

// @ CREATE
words.post("", async (req: Request, _res: Response) => {
  await new wordSchema({...req.body.user}).save();
});

// @ READ
words.get("/:ownerID", async (req: Request, res: Response) => {
  const ownerID = req.params.ownerID ? req.params.ownerID : null;
  const data = await wordSchema.find({ownerID});

  // Respond accordingly
  if (data.length === 0) res.status(204).send({ // NOT UNDEFINED.
    status: 204,
    message: "[EMPTY ARRAY] The words data not found",
    payload: data
  });
  else res.status(200).send({
    status: 200,
    message: "[SUCCESS] The words has been found",
    payload: data
  });

});

// @ UPDATE
words.put("", async (_req: Request, _res: Response) => {

});

// @ DELETE
words.delete("", (_req: Request, _res: Response) => {

});

export default words;