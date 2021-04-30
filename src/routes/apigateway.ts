import express from 'express';
// Routeres
import event from './apigateway/event';

const apigateway = express.Router();

apigateway.use("/event", event);

export default apigateway;