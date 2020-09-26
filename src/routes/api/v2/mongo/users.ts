import express, {Request, Response} from 'express';

const users = express.Router();

// @GET
users.get("", (_req: Request, res: Response) => {
  res.status(200).send({
    status: 200,
    message: 'OK: users'
  });
});


export default users;