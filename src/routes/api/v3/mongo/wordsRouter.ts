import express, {Request, Response} from 'express';
import wordSchema from '../../../../models/Words';
import moment from 'moment';

const words = express.Router();

// @ CREATE
words.post("/:ownerID", async (req: Request, res: Response) => {
  await req.body.payload.forEach((datus: any) => {
    new wordSchema({ ...datus, dateAdded: moment().valueOf() }).save()
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
words.put("/:ownerID", async (req: Request, res: Response) => {
  const payload = req.body.payload;
  payload.forEach(async (elem: any) => {
    await wordSchema.findOneAndUpdate({_id: elem.wordID}, {isFavorite: true}, {useFindAndModify: false})
  })
  res.send({empty: true});

});

// @ DELETE
words.delete("/:ownerID", async (req: Request, res: Response) => {
  // const { wordID } = req.params;
  // const {sem, IDs} = req.body.payload;
  console.log(req.body);

  res.status(204).send({
    status: 204,
    error: false,
    message: "[OK] Item 'word' deleted."
  })
});

export default words;