const subRouter = require('express').Router();
const pauseResumeSubRouter = require('./pause_resume_sub/pauseResumeSub');
const getSubDetailRouter = require('./get_sub_detail/getSubDetail');

subRouter.use('/pause_or_resume', pauseResumeSubRouter);
subRouter.use('/get', getSubDetailRouter);

module.exports = subRouter;