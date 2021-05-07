import express, { Request, Response } from 'express';

const validateRefreshtoken = express.Router();

validateRefreshtoken.post("/1.0", async (_req: Request, res: Response) => {
  res.send("Hello Event validateRefreshtoken")
});

export default validateRefreshtoken;