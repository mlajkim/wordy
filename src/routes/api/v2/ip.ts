import express, {Request, Response} from 'express';
import geoip from 'geoip-lite';

const ip = express.Router();

ip.get('/location', (req: Request, res: Response) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(ip);
  console.log(req.headers['x-forwarded-for'])
  console.log(req.connection.remoteAddress)
  console.log(geoip.lookup("211.202.88.226"));

  res.status(200).send({
    status: 200,
    message: "[OK]",
    payload: ip
  })
});

export default ip;