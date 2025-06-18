# 🧠 SQL Chatbot — Natural Language to SQL Querying Agent

A smart chatbot interface that converts natural language questions into SQL queries and retrieves answers from structured database tables. Currently supports single-table queries for product, customer, and sales data — ideal for visual analytics and dashboard integration.

---

## 📂 Tables Used

The agent is designed to work with the following three tables:

### `prods`
| Column       | Description               |
|--------------|---------------------------|
| `pid`        | Product ID (Primary Key)  |
| `name`       | Product name              |
| `categ`      | Product category          |
| `cost_price` | Cost price of the product |

### `customer`
| Column     | Description                   |
|------------|-------------------------------|
| `cid`      | Customer ID (Primary Key)     |
| `name`     | Customer name                 |
| `joint_dt` | Date the customer joined      |
| `typ`      | Customer type (e.g., Premium) |

### `sales`
| Column        | Description                          |
|---------------|--------------------------------------|
| `id`          | Sales record ID (Primary Key)        |
| `product_name`| Name of the product sold             |
| `revenue`     | Revenue generated from the sale      |
| `region`      | Region where the sale occurred       |
| `customer`    | Name or ID of the customer           |
| `quantity`    | Quantity of product sold             |

---

## 💡 Features

- 🗣️ **Natural Language Interface**: Ask questions like “What is the total revenue by region?” or “Top 5 most expensive products”.
- ⚡ **SQL Generation Engine**: Converts plain English to SQL.
- 📊 **Visualization-ready**: All outputs are suitable for bar, pie, line, or scatter plots.
- ✅ **Single Table Queries Supported**: Reliable for individual table queries (JOINs are currently not supported).

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

- **Node.js / Express** (Backend server)
- **Natural Language Processing**: Custom NLU or third-party model
- **SQLite / MySQL / PostgreSQL** (Any SQL-compliant DB)
- **Optional**: Chart.js / D3.js for frontend visualization

---

## 🚀 How to Run

```bash
# Clone the repo
git clone https://github.com/yourusername/sql-chatbot.git
cd sql-chatbot

# Install dependencies
npm install

# Start the server
node server.js
