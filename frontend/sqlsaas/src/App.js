// src/App.js
import React, { useState } from "react";
import {
  Bar,
  Line,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
  Scatter
} from "react-chartjs-2";
import { Chart as ChartJS, registerables } from 'chart.js';
import "./App.css";

ChartJS.register(...registerables);

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState(null);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const res = await fetch("http://localhost:3000/api/query/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput })
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [...prev, { sender: "bot", text: "❌ Invalid query. Try again." }]);
        return;
      }

      const summary = typeof data.summary === 'object' ? JSON.stringify(data.summary) : data.summary;

      if (data.chart && data.data) {
        const labels = data.data.map((item) => item[data.chart.x]);
        const values = data.data.map((item) => item[data.chart.y]);

        setChartData({
          labels,
          datasets: [
            {
              label: data.chart.y,
              data: values,
              backgroundColor: [
                "#007bff",
                "#28a745",
                "#dc3545",
                "#ffc107",
                "#17a2b8",
                "#6f42c1",
                "#fd7e14",
                "#20c997"
              ]
            }
          ]
        });
        setChartType(data.chart.type);
      } else {
        setChartData(null);
        setChartType(null);
      }

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: summary || "✅ Query executed successfully." }
      ]);

    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "🚫 Server error." }]);
    }
  };

  const renderChart = () => {
    if (!chartData || !chartType) return null;
    switch (chartType) {
      case "bar":
        return <Bar data={chartData} />;
      case "line":
        return <Line data={chartData} />;
      case "pie":
        return <Pie data={chartData} />;
      case "doughnut":
        return <Doughnut data={chartData} />;
      case "radar":
        return <Radar data={chartData} />;
      case "polarArea":
        return <PolarArea data={chartData} />;
      case "bubble":
        return <Bubble data={chartData} />;
      case "scatter":
        return <Scatter data={chartData} />;
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="header">📊 SQL SaaS Chatbot</header>
      <div className="main-layout">
        <div className="chat-section">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {typeof msg.text === 'object' ? JSON.stringify(msg.text) : msg.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Ask your SQL query..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
        <div className="chart-section">
          {chartData && <div className="chart-wrapper">{renderChart()}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
