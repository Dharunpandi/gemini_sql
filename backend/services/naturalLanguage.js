import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
console.log("AI client initialized:", ai);

/**
 * Calls Gemini AI to get summary + visualization suggestion for SQL query results.
 * @param {string} user_question - The natural language user question.
 * @param {string} sql_query - The SQL query generated for that question.
 * @param {Array|Object} data - The result data from SQL query (JSON serializable).
 * @returns {Promise<Object>} - Parsed JSON response from AI including summary and chart suggestion.
 */
export async function getAiSummaryAndChart(user_question, sql_query, data) {
  const prompt = `
You are a data analyst assistant.

Your task is to:
1. Interpret the user's question.
2. Analyze the given SQL query and its resulting data.
3. Summarize the data insight in plain English.
4. Decide whether a chart is appropriate.
5. If a chart is appropriate, suggest the chart type and which columns should be used for the x and y axes.

💡 Notes:
- Only suggest a chart if the data shows a clear numeric comparison, trend over time, distribution, or category breakdown.
- Use common chart types: "bar", "line", "pie", "scatter", "area". If none apply, return "chart": null.
- DO NOT hallucinate column names; only use column names that exist in the data.

✅ Always respond ONLY in **this JSON format**:

{
  "summary": "<concise explanation of the data and insights>",
  "chart": {
    "type": "bar" | "line" | "pie" | "scatter" | "area" | null,
    "x": "<column name to use for x-axis>",
    "y": "<column name to use for y-axis>"
  }
}

🧾 User Question:
${user_question}

🧠 SQL Query:
${sql_query}

📊 SQL Output Data (JSON format):
${JSON.stringify(data)}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 512,
      },
    });

    const rawText = response.text;
    console.log("Raw Gemini output:", rawText);

    let cleanText = rawText.trim()
      .replace(/^```json\s*/, '')
      .replace(/^```\s*/, '')
      .replace(/```$/, '')
      .replace(/[“”]/g, '"') // Convert smart quotes
      .trim();

    console.log("Cleaned Gemini output:", cleanText);

    const parsed = JSON.parse(cleanText);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "summary" in parsed &&
      "chart" in parsed
    ) {
      return parsed;
    } else {
      throw new Error("JSON keys are not exactly as expected");
    }
  } catch (error) {
    console.error("Error calling Gemini AI:", error);
    return {
      summary: "Failed to generate summary.",
      chart: null,
    };
  }
}
