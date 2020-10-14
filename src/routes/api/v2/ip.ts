import express, {Request, Response} from 'express';
import geoip from 'geoip-lite';

const ip = express.Router();

ip.get('/location', (req: Request, res: Response) => {
  const ip = req.connection.remoteAddress;
  const area = geoip.lookup(ip as string);
  process.stdout.write(`[Area: ${area? area : '?'}]\n`);
  if(area) {
    console.log(`IPv6: [${ip}] | ISO Country Code: [${area.country}] Connected`)
    res.status(200).send({
      status: 200,
      message: "[OK]",
      payloadType: "country code 2 letters KR, US.. such as.",
      payload: area.country
    })
  } else {
    res.status(204).send({
      status: 204,
      message: "[EMPTY] Area not found",
      payload: null
    })
  }

});

export default ip;