import express, {Request, Response} from 'express';

const event = express.Router();

event.get("", async (_req: Request, res: Response) => {
  res.send('Hello World!')
});

export default event;