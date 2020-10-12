import express, {Request, Response, NextFunction} from 'express';
import wordSchema from '../../../../models/Words';
const words = express.Router();

// @ LOGGER
const ROUTER_NAME = 'Word';
words.use('', (req: Request, _res: Response, next: NextFunction) => {
  process.stdout.write(`${ROUTER_NAME} `);
  req.body.ownerID = req.params.ownerID;
  next();
})
const logger = (data: string) => console.log(data + "...");

// @ CREATE
words.post("/:ownerID", (req: Request, res: Response) => {
  logger(`${req.body.payload.length} amount of words about to be saved`);
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


// @ READ
words.get("/:ownerID/:payload", async (req: Request, res: Response) => {
  const payload = JSON.parse(req.params.payload);
  const ownerID = req.params.ownerID;
  logger(`finding words with the following condition: ${req.params.payload}`)
  console.log(payload) // testing

  const data = await wordSchema.find({ownerID, ...payload});
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