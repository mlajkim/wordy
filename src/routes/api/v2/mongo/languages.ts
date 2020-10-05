import express, {Request, Response} from 'express';
import languageSchema from '../../../../models/Languages';

const languages = express.Router();

// @ CREATE
languages.post("", async (_req: Request, _res: Response) => {

});

// @ READ
languages.get("/:ownerID", async (req: Request, res: Response) => {
  const ownerID = req.params.ownerID ? req.params.ownerID : null;
  const data = await languageSchema.findOne({ownerID});

  // Respond accordingly
  if (data === null) res.status(204).send({ // NOT UNDEFINED.
    status: 204,
    message: "[NULL] The languages data not found",
    payload: null
  });
  else res.status(200).send({
    status: 200,
    message: "[SUCCESS] The languages has been found",
    payload: data
  });

});

// @ UPDATE
languages.put("", async (_req: Request, _res: Response) => {

});

// @ DELETE
languages.delete("", (_req: Request, _res: Response) => {

});

export default languages;