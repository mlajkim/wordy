import express, {Request, Response} from 'express';
import yearSchema from '../../../../models/Years';

const years = express.Router();

// @ CREATE
years.post("", async (req: Request, res: Response) => {
  await new yearSchema({ ...req.body.payload }).save();

  res.status(200).send({
    status: 200,
    message: '[OK] Years added'
  })
});

// @ READ
years.get("/all/:ownerID", async (req: Request, res: Response) => {
  const {ownerID} = req.params;
  const data = await yearSchema.find({ownerID})
  if(data) {
    res.send({
      status: 200,
      error: false,
      message: "[OK] The years data not found",
      payload: data
    })
  } else {
    res.send({
      status: 204,
      error: true,
      message: "[EMPTY DATA] The years data not found",
      payload: data
    })
  }
  
});

// @ READ
years.get("/one/:ownerID/:year/:sem", async (req: Request, res: Response) => {
  const {ownerID, year, sem} = req.params;
  const data = await yearSchema.findOne({ownerID, year, sem})
  if(data) {
    res.send({
      status: 200,
      message: "[OK] The years data not found",
      payload: data
    })
  } else {
    res.send({
      status: 204,
      message: "[EMPTY DATA] The years data not found",
      payload: data
    })
  }
  
});

// @ UPDATE
years.put("/:ownerID", async (_req: Request, _res: Response) => {
});

// @ DELETE
years.delete("/one/:ownerID/:year/:sem", async (req: Request, res: Response) => {
  await yearSchema.findOneAndDelete({ ...req.params });

  res.status(204).send({
    status: 204,
    error: false,
    message: "[OK] Item 'year' deleted."
  })
});

export default years;