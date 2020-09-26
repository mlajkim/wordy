import express, {Request, Response} from 'express';

const v2 = express.Router();

v2.get("", (req: Request, res: Response) => {
  console.log(req.body);
  res.send({
    message: 'welcome to v2 router'
  })
})

export default v2;