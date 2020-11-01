import express, { Request, Response } from 'express';
import wordSchema from '../../../../models/Words';
import moment from 'moment';

const words = express.Router();

// @ CREATE (Fetchy 3)
words.post("/fetchy3", (req: Request, res: Response) => {
  const lengthRequired = req.body.payload.length;
  const newWordsList: any[] = [];

  req.body.payload.forEach(async (datus: any) => {
    const newWord = await new wordSchema({ ...datus, dateAdded: moment().valueOf() }).save();
    newWordsList.push(newWord);
    if (lengthRequired === newWordsList.length) {
      res.send({
        empty: false,
        payload: newWordsList
      })
    }
  })
});

// @ READ (Fetchy 3)
words.get("/:ownerID/:sem", async (req: Request, res: Response) => {
  const {ownerID, sem} = req.params;

  const data = await wordSchema.find({ownerID, sem});
  res.send({
    empty: data.length === 0 ? true : false,
    payload: data
  })
});

// @ UPDATE
words.put("/:ownerID", async (req: Request, res: Response) => {
  const payload = req.body.payload;
  payload.forEach(async (elem: any) => {
    await wordSchema.findOneAndUpdate({_id: elem.wordID}, elem.payload, {useFindAndModify: false})
  })
  res.send({empty: true});

});

// @ DELETE
words.delete("/:ownerID", async (req: Request, res: Response) => {
  const IDs = req.body.payload;
  console.log(IDs);
  IDs.forEach(async ({ID}: {ID: string}) => await wordSchema.findOneAndDelete({_id: ID}));

  res.status(204).send({empty: true});
});

export default words;