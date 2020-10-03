import express, {Request, Response, NextFunction} from 'express';
import auth from './v2/auth';
import mongo from './v2/mongo';
import ip from './v2/ip';

const v2 = express.Router();
v2.use((_req: Request, _res: Response, next: NextFunction) => {
  console.log("\n*********************************************************");
  console.log(`${new Date().toString()}`);
  next();
});
v2.use('/ip', ip);
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