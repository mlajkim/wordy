import express, { Request, Response } from 'express';
const wordsPost = express.Router();


// @POST Here
wordsPost.post("", async (_req: Request, res: Response) => {
  res.send("hi")
});

export default wordsPost;