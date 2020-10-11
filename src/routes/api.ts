import express from 'express';
import v2 from './api/v2';
import v3Router from './api/v3Router';

const api = express.Router();

api.use("/v2", v2)
api.use("/v3", v3Router)

export default api;