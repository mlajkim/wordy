import express, {NextFunction, Request, Response} from 'express';
// import * as utils from '../../type/utils';

const event = express.Router();

event.use(async (req: Request, res: Response, _next: NextFunction) => {

  res.send("wut");
});


// Random generate hash + get IP + Country + Who is this dude?

export default event;