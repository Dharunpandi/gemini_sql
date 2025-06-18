import express from 'express';
import cors from 'cors'; // ✅ Add this
import 'dotenv/config';
import queryrouter from './routes/queryRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

console.log("server.js is executing");

app.use(cors()); // ✅ Enable CORS for all origins
app.use(express.json());
app.use('/api/query', queryrouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
