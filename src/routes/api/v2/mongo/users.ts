import express, {Request, Response} from 'express';
import userSchema from '../../../../models/Users';

const users = express.Router();

// @ CREATE
users.post("", async (req: Request, res: Response) => {
  await new userSchema({...req.body.user}).save();
  console.log(`
    ***NEW USER ADDED***
    Name: ${req.body.user.lastName} ${req.body.user.firstName}
    Email address: ${req.body.user.email}
  `)
});

// @ READ
users.get("", async (req: Request, res: Response) => {
  // Find user
  const {federalProvider, federalID} = req.body.user;
  const data = await userSchema.findOne({federalProvider, federalID});

  // Respond accordingly
  if (data === null) res.status(204).send({ // NOT UNDEFINED.
    status: 204,
    message: "[NULL] The user data not found",
    user: null
  });
  else res.status(200).send({
    status: 200,
    message: "[SUCCESS] The user has been found",
    user: data
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
users.delete("", (_req: Request, res: Response) => {
  res.status(200).send({
    status: 204,
    message: 'OK: users delete'
  });
});

export default users;