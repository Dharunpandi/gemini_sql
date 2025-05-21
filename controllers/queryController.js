import { getGeminiSQLWithTable } from '../services/queryService.js';
import { runSQL } from '../services/dbService.js';

export const generateSQL = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    const result = await getGeminiSQLWithTable(question);
    console.log(result)
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Generate Sql shows error" });
  }
};

export const executeSQL = async (req, res) => {
  const { sql } = req.body;
  if (!sql) return res.status(400).json({ error: 'SQL is required' });

  try {
    const data = await runSQL(sql);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const askAndQuery = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    const { sql, table } = await getGeminiSQLWithTable(question);
    const data = await runSQL(sql);
    res.json({ sql, table, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
