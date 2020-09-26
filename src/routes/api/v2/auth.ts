import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const auth = express.Router();
dotenv.config();

// @POST
auth.post("/login", (_req: Request, res: Response) => {
  const user = {
    name: "Jeongwoo"
  }
  const accessToken = generateUserAccessToken(user);

  res.status(200).send({
    status: 200,
    message: 'OK: Successful Login',
    accessToken: accessToken
  })
})

// @FUNCTION
const generateUserAccessToken = (user: any) => {
  return jwt.sign(user, process.env.LOGIN_ACCESS_TOKEN_SECRET!, {expiresIn: '60s'})
}


export default auth;