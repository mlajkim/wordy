import express from 'express';
import v2 from './api/v2';

const api = express.Router();

api.use("/v2", v2)

export default api;