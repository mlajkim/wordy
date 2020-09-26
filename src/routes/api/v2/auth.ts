import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

const auth = express.Router();
dotenv.config();

// @POST: LOGIN
auth.post("/login", (_req: Request, res: Response) => {
  const user = {
    name: "Jeongwoo"
  };
  const accessToken = generateUserAccessToken(user);
  const refreshToken = generateUserRefreshToken(user);

  res.status(200).send({
    status: 200,
    message: 'OK: Successful Login',
    accessToken: accessToken,
    refreshToken: refreshToken
  });
});

// @POST: GENERATE ACCESS TOKEN FROM REFRESH TOKEN
auth.post("/token", (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  // handle when it is null
  if(refreshToken === null) res.status(401).send({
    status: 401,
    message: 'NOT AUTHORIZED: REFRESH TOKEN NOT PROVIDED'
  });


})

// @FUNCTION
const generateUserAccessToken = (user: any) => {
  return jwt.sign(user, process.env.LOGIN_ACCESS_TOKEN_SECRET!, {expiresIn: '60s'})
}

// @FUNCTION
const generateUserRefreshToken = (user: any) => {
  return jwt.sign(user, process.env.LOGIN_ACCESS_TOKEN_SECRET!, {expiresIn: '60s'})
}


export default auth;