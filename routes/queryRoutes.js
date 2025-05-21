import express from 'express';
import { generateSQL, executeSQL, askAndQuery } from '../controllers/queryController.js';

const queryrouter = express.Router();

queryrouter.post('/generate-sql', generateSQL);
queryrouter.post('/run-sql', executeSQL);
queryrouter.post('/ask', askAndQuery);

export default queryrouter;
