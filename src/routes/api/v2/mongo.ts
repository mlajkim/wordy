import express, {Request, Response, NextFunction} from 'express';
import users from './mongo/users';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

// @FUNCTION
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // undefined, or actual token

  // Handle when token not given.
  if(token == null) res.status(401).send({
    status: 401,
    message: 'NOT AUTHORIZED: ACCESS TOKEN NOT PROVIDED'
  })
  console.log(process.env.LOGIN_ACCESS_TOKEN_SECRET)
  jwt.verify(token!, process.env.LOGIN_ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    // handle when token has been invalid (expired)
    if (err) res.status(403).send({
      status: 403,
      message: 'FORBIDDEN: TOKEN EXPIRED OR INVALID'
    });

    req.headers.user = user; // may change
  });
  //console.log(req.headers); // will use it eventually
  next();
};

const mongo = express.Router();
mongo.use("", authenticateUser)
mongo.use("/users", users);
dotenv.config();

export default mongo;