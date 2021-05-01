import express, {Request, Response} from 'express';
import * as wambda from '../../../type/wambda';

const ip = express.Router();

ip.get('/location', (req: Request, res: Response) => {
  const ipData = wambda.getLocationFromIp(req);
  const ip = ipData.ip
  const countryName = ipData.countryName
  process.stdout.write(`[Area: ${countryName? countryName : '?'}]\n`);
  if(countryName) {
    console.log(`IPv6: [${ip}] | ISO Country Code: [${countryName}] Connected`)
    res.status(200).send({
      status: 200,
      message: "[OK]",
      payloadType: "country code 2 letters KR, US.. such as.",
      payload: countryName
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