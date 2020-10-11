import express, {Request, Response} from 'express';
import wordSchema from '../../../../models/Words';
const words = express.Router();

// @ CREATE
words.post("", (req: Request, res: Response) => {
  console.log(req.body);// testing
  console.log(`${req.body.payload.length} amount of words about to be saved.`);
  req.body.payload.forEach(async (datus: any) => {
    new wordSchema({ ...datus }).save()
      .then(_resp => res.send({
        status:200,
        message: `[OK]`
      }))
      .catch(err => res.status(404).send({
        status: 404,
        message: `[FAIL] ${err}`
      }))
  })
});

// @ CREATE
words.post("/extra", async (_req: Request, _res: Response) => {

});

// @ READ
words.get("/section/:ownerID/:year/:sem/", async (req: Request, res: Response) => {
  const {ownerID, year, sem} = req.params;
  const data = await wordSchema.find({ownerID, year, sem});

  // Respond accordingly
  if (data.length === 0) res.status(404).send({ // NOT UNDEFINED.
    status: 404,
    message: "[EMPTY ARRAY] The words data not found",
    payload: null
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
words.delete("/one/:wordID", async (req: Request, res: Response) => {
  const { wordID } = req.params;
  await wordSchema.findByIdAndDelete(wordID);

  res.status(204).send({
    status: 204,
    error: false,
    message: "[OK] Item 'word' deleted."
  })
});

export default words;