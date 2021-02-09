import express, { Request, Response } from 'express';
const v4RefreshToken = express.Router();
import { connectToMongoDB } from '../../../../utils';


v4RefreshToken.use(connectToMongoDB); // Connect to DB

v4RefreshToken.get("/:federalProvider/:federalID", async (_req: Request, res: Response) => {
  res.send("hey");
  // Check if it exists
  
  // if not, sends an error message of 404
  // Generaate new refresh token
  // Replace the old refresh token
  // Sneds a 200 request with the payload of refresh token
  
});

export default v4RefreshToken;