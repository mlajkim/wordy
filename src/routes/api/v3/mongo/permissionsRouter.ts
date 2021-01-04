import express, {Request, Response} from 'express';
import permissionsSchema from '../../../../models/Permissions';
import dotenv from 'dotenv';
import moment from 'moment';

const permissions = express.Router();
const EXPIRING_MINUTES = 60;
dotenv.config();

// @ CREATE
permissions.post("", async (req: Request, res: Response) => {
  console.log(req.body);

  // If not permitted user(admin), then send wrong
  console.log(req.body.ownerID)
  console.log(process.env.ADMIN_USER_ID)
  if (req.body.ownerID !== process.env.ADMIN_USER_ID) {
    res.status(403).send({
      message: 'Only admin can generate the access code'
    });
  }
  else {
    const newPermission = await new permissionsSchema({
      permissionCode: require('crypto').randomBytes(16).toString('hex'),
      expiringAt: moment().valueOf() + (60 * 1000 * EXPIRING_MINUTES)
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

permissions.get("/:playerID/:permissionCode", async (req: Request, res: Response) => {
  const { permissionCode } = req.params;
  const response = (await permissionsSchema.find({ permissionCode }))[0]
  const data = typeof response !== 'undefined' ? response.toObject() : undefined;
  let isSuccessful = "true"

  if (typeof data === 'undefined') isSuccessful = "does not exist"; // if does not exist
  else {
    if (data.isExpired >= moment().valueOf()) isSuccessful = "expired"; // if expired
    if (typeof data.playerID === 'string') isSuccessful = "already used"; // if already asigned
  }
  res.send({
    payload: {
      isSuccessful: isSuccessful === 'true' ? true : false,
      message: isSuccessful
    }
  })
})

export default permissions;