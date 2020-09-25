const userRouter = require('express').Router();

const getUserRouter = require('./getUser');
const postUserRouter = require('./postUser');
const putUserRouter = require('./putUser');
const deleteUserRouter = require('./deleteUser');

userRouter.use('/get', getUserRouter);
userRouter.use('/post', postUserRouter);
userRouter.use('/put', putUserRouter);
userRouter.use('', deleteUserRouter);

module.exports = userRouter;