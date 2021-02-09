import express, { Request, Response, NextFunction } from 'express';
const wordsPost = express.Router();

const validateWordsBodyInput = (_req: Request, _res: Response, next: NextFunction) => {

  next();
};

// @POST Here
wordsPost.use(validateWordsBodyInput);
wordsPost.post("", async (_req: Request, res: Response) => {
  res.send("hi");

});



export default wordsPost;