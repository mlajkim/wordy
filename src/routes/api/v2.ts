import express, {Request, Response} from 'express';
import auth from './v2/auth';
import mongo from './v2/mongo';

const v2 = express.Router();
v2.use('/auth', auth);
v2.use('/mongo', mongo);

// @GET
v2.get("", (_req: Request, res: Response) => {
  res.status(200).send({
    status: 200,
    message: 'OK'
  });
});



export default v2;