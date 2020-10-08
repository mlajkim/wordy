import express, {Request, Response} from 'express';
import userSchema from '../../../../models/Users';

const users = express.Router();

// @ CREATE
users.post("", async (req: Request, _res: Response) => {
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
    error: true,
    message: "[NULL] The user data not found",
    payload: null
  });
  else res.status(200).send({
    status: 200,
    error: false,
    message: "[SUCCESS] The user has been found",
    payload: data
  });
});

// @ UPDATE
users.put("", async (req: Request, res: Response) => {
  // This case, await is extremely important, otherwise the it will finish the connection with mongo DB
  await userSchema.findOneAndUpdate({
    federalProvider: req.body.user.federalProvider,
    federalID: req.body.user.federalID
  }, {...req.body.payload}, {useFindAndModify: false});

  res.status(200).send({
    status: 200,
    message: 'OK: users update (This does not gaurantee the change'
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