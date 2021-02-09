import express, { Request, Response } from 'express';
const v4RefreshToken = express.Router();

v4RefreshToken.get("/refreshToken", async (_req: Request, res: Response) => {
  res.send("hey");
  
});

export default v4RefreshToken;