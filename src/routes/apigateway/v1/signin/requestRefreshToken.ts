import express, { Request, Response, NextFunction } from 'express';
import { connectToMongoDB } from '../../../../internal/mongo';

const generateRefreshToken = express.Router();

// Connects to MDB for checking
generateRefreshToken.use(connectToMongoDB);

generateRefreshToken.post("/1.0", async (req: Request, _res: Response, next: NextFunction) => {
  const payload = req.body.payload;
  console.log(payload);

  next();
});

generateRefreshToken.post("/1.0", async (req: Request, res: Response) => {
  const payload = req.body.payload;
  console.log(payload);
  res.send("Hello Event Driven Arch. World!")
});

export default generateRefreshToken;