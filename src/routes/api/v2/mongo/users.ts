import express, {Request, Response} from 'express';

const users = express.Router();

// @ CREATE
users.post("", (_req: Request, res: Response) => {
  res.status(200).send({
    status: 200,
    message: 'OK: users create'
  });
});

// @ READ
users.get("", (_req: Request, res: Response) => {
  res.status(200).send({
    status: 200,
    message: 'OK: users read'
  });
});

// @ UPDATE
users.put("", (_req: Request, res: Response) => {
  res.status(200).send({
    status: 200,
    message: 'OK: users update'
  });
});

// @ DELETE
users.post("", (_req: Request, res: Response) => {
  res.status(200).send({
    status: 200,
    message: 'OK: users delete'
  });
});

export default users;