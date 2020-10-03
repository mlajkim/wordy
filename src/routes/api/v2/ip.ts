import express, {Request, Response} from 'express';

const ip = express.Router();

ip.get('/location', (req: Request, res: Response) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip);

  res.status(200).send({
    status: 200,
    message: "[OK]",
    payload: ip
  })
});

export default ip;