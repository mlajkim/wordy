import express, {Request, Response} from 'express';

const v2 = express.Router();

v2.get("", (_req: Request, res: Response) => {
  res.status(200).send({
    status: 200,
    message: 'OK'
  })
})

export default v2;