import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const basePrompt = `You are a SQL expert. Convert the user's question into:

1. SQL query
2. The table name used in that query

Database schema:

Table: Sales_Data_2024  
Columns: id, product_name, revenue, region, quantity, customer

Table: Coustomer  
Columns: cid, name, join_dt, typ, is_actv

Table: prods  
Columns: pid, name, categ, cost_price

Return output in exact JSON format (no comments or extra text):

{
  "sql": "<SQL_QUERY>",
  "table": "<TABLE_NAME>"
}

Examples:

Question: "List all active customers"  
{
  "sql": "SELECT * FROM Coustomer WHERE is_actv = true",
  "table": "Coustomer"
}

Question: "Show revenue from product 'Widget A'"  
{
  "sql": "SELECT revenue FROM Sales_Data_2024 WHERE product_name = 'Widget A'",
  "table": "Sales_Data_2024"
}

Only return the JSON. If there is no question given, say "no question given".
`;

export async function getGeminiSQLWithTable(question) {
  if (!question || question.trim() === "") {
    return { error: "no question given" };
  }

  const response = await ai.generateContent({
    model: 'gemini-1.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: `${basePrompt}\n\nQuestion: "${question}"` }],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 300,
    },
  });

  // Access the actual content correctly
  const rawText =
    response?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Clean the text to ensure it's parsable
  const cleanText = rawText
    .replace(/[“”]/g, '"') // smart quotes to normal quotes
    .trim();

  console.log("Gemini raw output:", cleanText);

  try {
    return JSON.parse(cleanText);
  } catch (err) {
    throw new Error("Gemini returned invalid JSON:\n" + cleanText);
  }
}
