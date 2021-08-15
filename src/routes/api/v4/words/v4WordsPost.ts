import express, { NextFunction, Request, Response } from 'express';
const wordsPost = express.Router();
import moment from 'moment';
// utils
import { getSem } from '../../../../utils';
// Types
import { User, Support } from '../../../../typesBackEnd';
// Models
import userSchema from '../../../../models/Users';
import supportSchema from '../../../../models/Supports';
import wordSchema from '../../../../models/Words';
// JSON
import response from '../../../../responseStandard.json';
import standard from '../../../../businessStandard.json';

// Fatal Error. The user has to exist. but somehow the DB no longer has it. (HANDLE ERROR)
wordsPost.use("", async (req: Request, res: Response, next: NextFunction) => {
  const { federalProvider, federalID }: User = req.body.user;
  const user: User = req.body.userMongo = (await userSchema.findOne({ federalProvider, federalID }))?.toObject();
  if (!user) {
    const status = 404;
    res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "[FATAL ERROR] The user does not exist"
    });
  }
  else {
    next();
  }
});

// if payload is not an array (or object) but also not an array, then sends an error (HANDLE ERROR)\
wordsPost.use("", (req: Request, res: Response, next: NextFunction) => {
  const payloads: Payload[] = req.body.payloads;

  if (typeof payloads !== 'object' || typeof payloads.length === 'undefined') {
    const status = 406;
    res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "Unable to find a proper data in your body. Make sure to send in an array even when adding one word"
    });
  }
  else {
    next();
  };
});


// if given body has 0 data, sends an error (HANDLE ERROR) 
wordsPost.use("", (req: Request, res: Response, next: NextFunction) => {
  const payloads: Payload[] = req.body.payloads;

  const convertedPayloads = [...payloads];
  if (convertedPayloads.length === 0) {
    const status = 406;
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: "Send at least one item in the array."
    });
  }
  else if (convertedPayloads.length > standard.ADD_WORD_MAXIMUM_STANDARD) {
    const status = 413;
    return res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: `Exceeded limit per request. Your attempt: ${convertedPayloads.length} | Current Maximum: ${standard.ADD_WORD_MAXIMUM_STANDARD}`
    });
  }
  else {
    next();
  };
});


// Credit Limit Error Handle (HANDLE ERROR) (CHECKED) 
wordsPost.use("", async (req: Request, res: Response, next: NextFunction) => {
  const convertedPayloads = [...req.body.payloads];
  const user: User = req.body.userMongo;

  const userAttemptAddingLength = convertedPayloads.length;
  const userCreditLimit = typeof user.creditLimit === 'undefined' ? standard.CREDIT_LIMIT_STANDARD : user.creditLimit;
  const support: Support = req.body.supportMongo = (await supportSchema.findOne({ ownerID: user._id }))?.toObject();
  if (support.newWordCnt + userAttemptAddingLength > userCreditLimit) {
    const status = 402;
    res.status(status).send({
      status: response[status].status,
      message: response[status].message,
      details: `Left over amount: ${userCreditLimit - support.newWordCnt < 0 ? 0 : userCreditLimit - support.newWordCnt} words | Your attempt: ${userAttemptAddingLength} words`
    });
  } else {
    next();
  };
});


// Language choice error (HANDLE ERROR)  
wordsPost.use("", (req: Request, res: Response, next: NextFunction) => {
  const convertedPayloads = [...req.body.payloads];
  const availableLanguages = ['en', 'ko', 'ja', 'zh'];
  let errorRaised = false;

  convertedPayloads.forEach((word: Payload) => {
    const languageIndex = availableLanguages.findIndex(lang => word.language === lang);
    if (languageIndex === -1) errorRaised = true;
  });
  if (errorRaised) {
    const status = 406;
      res.status(status).send({
        status: response[status].status,
        message: response[status].message,
        details: "Only certain languages can be added (List in the documents)"
      });
  } else {
    next();
  };
});

// @ POST
wordsPost.post("", async (req: Request, res: Response) => {
  const convertedPayloads = [...req.body.payloads];
  const user: User = req.body.userMongo;
  const support: Support = req.body.supportMongo;

  // Finally execute the code
  let newOrderCnt = support.newWordCnt;
  convertedPayloads.forEach(async (word: Payload) => {
    await new wordSchema({
      language: word.language,
      word: word.word,
      pronun: word.pronun,
      meaning: word.meaning,
      example: word.example,
      // done by backend server
      tag: [],
      ownerID: user._id,
      dateAdded: moment().valueOf(),
      isFavorite: false,
      sem: getSem(),
      order: ++newOrderCnt
     }).save().catch((err: any)  => console.log(err));
  });
  
  // Setup the Supports Data Too.
  await supportSchema.findOneAndUpdate({ ownerID: user._id }, {
    newWordCnt: newOrderCnt
  }, {useFindAndModify: false}).catch((err: any) => console.log(err));

  const status = 200;
  res.status(status).send({
    status: response[status].status,
    message: response[status].message
  });
});

// Other values are not accepted
type Payload = {
  word: string;
  pronun: string;
  meaning: string;
  example: string;
  tag: string;
  sem: number;
  language: 'en' | 'ko' | 'ja' | 'zh';
}

export default wordsPost;