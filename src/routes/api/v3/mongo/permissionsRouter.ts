import express, {Request, Response} from 'express';
import permissionsSchema from '../../../../models/Permissions';
import dotenv from 'dotenv';

const permissions = express.Router();
dotenv.config();

// @ CREATE
permissions.post("", async (req: Request, res: Response) => {
  console.log(req.body);

  // If not permitted user(admin), then send wrong
  console.log(req.body.ownerID)
  console.log(process.env.ADMIN_USER_ID)
  if (req.body.ownerID !== process.env.ADMIN_USER_ID) {
    console.log("Oops.. failed")
    res.status(403).send({
      message: 'Only admin can generate the access code'
    });
  }
  else {
    const newPermission = await new permissionsSchema({
      permissionCode: require('crypto').randomBytes(16).toString('hex')
    }).save();
    res.send({ empty: false, length: 1, payload: newPermission })
  }
});

permissions.get("/:userID", async (req: Request, res: Response) => {
  const playerID = req.params.userID;
  const data = await permissionsSchema.find({ playerID });
  console.log(data);
  res.send({
    empty: data.length === 0 ? true : false,
    payload: {
      found: data.length === 0 ? false : true,
      data: data[0] // only sending one
    }
  })
})

export default permissions;