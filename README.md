# 🧠 SQL Chatbot — Natural Language to SQL Querying Agent

A smart chatbot interface that converts natural language questions into SQL queries and retrieves answers from structured database tables. Designed for data visualization and dashboard integration, this version focuses on **single-table** queries to keep things fast, simple, and reliable.

🎥 **[📎 Demo Video](https://drive.google.com/file/d/1G003fx2-PGA3cuRXB29g53uj5AeAOHjp/view?usp=sharing)**

---

## 📂 Tables Used

The agent works with the following **three** tables:

### 🔸 `prods`
| Column       | Description               |
|--------------|---------------------------|
| `pid`        | Product ID (Primary Key)  |
| `name`       | Product name              |
| `categ`      | Product category          |
| `cost_price` | Cost price of the product |

### 🔸 `customer`
| Column     | Description                   |
|------------|-------------------------------|
| `cid`      | Customer ID (Primary Key)     |
| `name`     | Customer name                 |
| `joint_dt` | Date the customer joined      |
| `typ`      | Customer type (e.g., Premium) |

### 🔸 `sales`
| Column         | Description                          |
|----------------|--------------------------------------|
| `id`           | Sales record ID (Primary Key)        |
| `product_name` | Name of the product sold             |
| `revenue`      | Revenue generated from the sale      |
| `region`       | Region where the sale occurred       |
| `customer`     | Name or ID of the customer           |
| `quantity`     | Quantity of product sold             |

---

## 💡 Features

- 🗣️ **Natural Language Interface**  
  Ask questions like “What is the total revenue by region?” or “Top 5 most expensive products”.

- ⚡ **SQL Generation Engine**  
  Converts plain English to executable SQL queries.

- 📊 **Visualization-Ready**  
  Outputs are formatted for bar, pie, line, or scatter plots.

- ✅ **Single Table Queries Supported**  
  JOINs are currently not supported — keeps performance high and logic simple.

---

## ✅ Example Questions to Try

### 🔹 `prods` Table
- What is the average cost price for each category?
- List all products with a cost price above 1000.
- Show number of products in each category.

### 🔹 `customer` Table
- How many customers joined in 2023?
- Show customer count grouped by type.
- List customers whose names start with 'S'.

### 🔹 `sales` Table
- Show total revenue by region.
- Which products were sold more than 50 times?
- What are the top 5 products by total revenue?

---

## 🛠️ Tech Stack

- **Node.js / Express** — Backend server
- **Natural Language Processing** — Custom logic or 3rd-party NLU service
- **SQLite / MySQL / PostgreSQL** — SQL-compliant database
- **Optional**: Chart.js or D3.js for frontend data visualization

---

## 🚀 How to Run

```bash
# Clone the repository
git clone https://github.com/yourusername/sql-chatbot.git
cd sql-chatbot

# Install dependencies
npm install

# Start the server
node server.js
