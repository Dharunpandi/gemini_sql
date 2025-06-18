import { getGeminiSQLWithTable } from '../services/queryService.js';
import { runSQL } from '../services/dbService.js';
import { getAiSummaryAndChart } from '../services/naturalLanguage.js';

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

    if (!sql || !table) {
      return res.status(400).json({ error: "Both SQL query and table name are required" });
    }

    const data = await runSQL(sql, table);
    const aiResult = await getAiSummaryAndChart(question, sql, data);

    res.json({
      sql,
      table,
      data,
      summary: aiResult.summary,
      chart: aiResult.chart,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
