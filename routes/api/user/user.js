const userRouter = require('express').Router();

const getUserRouter = require('./getUser');
const postUserRouter = require('./postUser');
const putUserRouter = require('./putUser');
const deleteUserRouter = require('./deleteUser');

userRouter.use('/', getUserRouter);
userRouter.use('/', postUserRouter);
userRouter.use('/', postUserRouter);
userRouter.use('/', deleteUserRouter);

module.exports = userRouter;