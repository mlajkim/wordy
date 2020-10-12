import express, {Request, Response} from 'express';
import wordSchema from '../../../../models/Words';
const words = express.Router();

// @ CREATE
words.post("/:ownerID", async (req: Request, res: Response) => {
  await req.body.payload.forEach((datus: any) => {
    new wordSchema({ ...datus }).save()
  })

  res.send({empty: true})
});


// @ READ
words.get("/:ownerID/:sem", async (req: Request, res: Response) => {
  const {ownerID, sem} = req.params;

  const data = await wordSchema.find({ownerID, sem});
  res.send({
    empty: data.length === 0 ? true : false,
    length: data.length,
    data: data
  })
});

// @ UPDATE
words.put("/:ownerID", async (_req: Request, _res: Response) => {

});

// @ DELETE
words.delete("/:ownerID", async (req: Request, res: Response) => {
  const { wordID } = req.params;
  await wordSchema.findByIdAndDelete(wordID);

  res.status(204).send({
    status: 204,
    error: false,
    message: "[OK] Item 'word' deleted."
  })
});

export default words;