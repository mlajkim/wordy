import express, { Request, Response } from 'express';

const generateRefreshToken = express.Router();

generateRefreshToken.post("/1.0", async (_req: Request, res: Response) => {
  res.send("Hello Event Driven Arch. World!")
});

export default generateRefreshToken;