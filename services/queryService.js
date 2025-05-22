import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
console.log("AI client initialized:", ai);

const basePrompt = `You are a postgreSQL expert. Convert the user's question into:

1. postgreSQL query

2. The table name used in that query

Database schema:

Table: Sales_Data_2024  
Columns: id, product_name, revenue, region, quantity, customer

Table: Customers
Columns: cid, name, join_dt, typ, is_actv

Table: prods  
Columns: pid, name, categ, cost_price

**IMPORTANT:**  
- ONLY return a single JSON object with exactly these keys: "sql" and "table".  
- DO NOT include any explanations, comments, or extra text.  
- The JSON must be valid and nothing else should be output.

Example valid output:

{
  "sql": "SELECT * FROM Customers WHERE is_actv = true",
  "table": "Customers"
}
  * you should have to give the correct postgres query that it should be in the table and include valid columns

If no question is provided, just return:  
"no question given"
give postgre query it is important dont give sql query 
give easier postgres queries for data right 
`;

export async function getGeminiSQLWithTable(question) {
  if (!question || question.trim() === "") {
    console.log("No question given.");
    return { error: "no question given" };
  }
  console.log("Gemini question:", question);

  try {
    if (!ai.models || !ai.models.generateContent) {
      throw new Error("generateContent method not found on ai.models");
    }
    console.log("Calling generateContent API...");

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${basePrompt}\n\nQuestion: "${question}"` }],
        },
      ],
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 300,
      },
    });

    console.log("response generated");

    const rawText = response.text;
    console.log("Raw Gemini output:", rawText);

    // Remove Markdown triple backticks and optional "json" language hint
    let cleanText = rawText.trim();
    cleanText = cleanText
      .replace(/^```json\s*/, '')  // Remove ```json at start
      .replace(/^```\s*/, '')      // Remove ``` at start (if no json)
      .replace(/```$/, '')         // Remove trailing ```
      .replace(/[“”]/g, '"')       // Replace smart quotes with normal quotes
      .trim();

    console.log("Cleaned Gemini output:", cleanText);

    const parsed = JSON.parse(cleanText);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Object.keys(parsed).length === 2 &&
      "sql" in parsed &&
      "table" in parsed
    ) {
      return parsed;
    } else {
      throw new Error("JSON keys are not exactly as expected");
    }
  } catch (err) {
    console.error("Error in getGeminiSQLWithTable:", err);
    throw new Error(
      "Gemini output is not valid strict JSON with required keys:\n" + (err.message || err)
    );
  }
}
