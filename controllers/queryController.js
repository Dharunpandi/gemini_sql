import { getGeminiSQLWithTable } from '../services/queryService.js';
import { runSQL } from '../services/dbService.js';

console.log("queryController.js is executing");

export const generateSQL = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    const result = await getGeminiSQLWithTable(question);
    console.log(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Generate SQL failed", details: err.message });
  }
};

export const executeSQL = async (req, res) => {
  const { sql, table } = req.body;
  if (!sql) return res.status(400).json({ error: 'SQL is required' });

  try {
    console.log("Executing SQL:", sql);
    const data = await runSQL(sql, table);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const askAndQuery = async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  try {
    const result = await getGeminiSQLWithTable(question);
    const { sql, table } = result;

    // Debug logs
    console.log("Generated SQL:", sql);
    console.log("Target Table:", table);

    // Validate both sql and table
    if (!sql || !table) {
      return res.status(400).json({ error: "Both SQL query and table name are required" });
    }

    const data = await runSQL(sql, table);
    res.json({ sql, table, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
