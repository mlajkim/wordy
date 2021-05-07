import express from 'express';
// Routeres
import v1 from './apigateway/v1';

const apigateway = express.Router();

apigateway.use("/v1", v1);

export default apigateway;