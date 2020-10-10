import express, {Request, Response} from 'express';
import wordSchema from '../../../../models/Words';
import {getDate} from '../../../../utils';
import moment from 'moment';
const words = express.Router();

// @ CREATE
words.post("/default", async (req: Request, res: Response) => {
  // Add the words into the database
  const now = getDate();
  const newWord = await new wordSchema({...req.body.payload,
    dateAdded: now.now,
    year: now.year,
    sem: now.sem
  }).save();

  res.status(200).send({
    status: 200,
    message: '[OK] Word added',
    payload: newWord
  })
});

// @ CREATE
words.post("/extra", async (req: Request, res: Response) => {
  // This is used when you would like to have custom year and semester (compared to /default)
  // Add the words into the database
  const now = moment();
  const newWord = await new wordSchema({...req.body.payload,
    dateAdded: now,
    year: req.body.extra.extraYear,
    sem: req.body.extra.extraSem
  }).save();

  res.status(200).send({
    status: 200,
    message: '[OK] Word added',
    payload: newWord
  })
});

// @ CREATE
words.post("/chunk", (req: Request, res: Response) => {
  // This is used when you would like to have custom year and semester (compared to /default)
  // Add the words into the database
  console.log(`${req.body.payload.length} amount of words received.`)
  req.body.payload.forEach(async (datus: any) => {
    await new wordSchema({
      dateAdded: moment(),
      ...datus,
      language: req.body.extra.language,
      year: req.body.extra.extraYear,
      sem: req.body.extra.extraSem
    }).save();
  })

  res.status(200).send({
    status: 200,
    message: '[OK] Mass words added'
  });
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

// @ UPDATE
words.put("/tag", async (_req: Request, _res: Response) => {

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