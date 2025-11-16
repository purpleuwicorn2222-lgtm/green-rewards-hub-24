import express from 'express';
import cors from 'cors';
import { searchProducts } from './services/seleniumSearch.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Eco Shopping Backend is running' });
});

// Product search endpoint
app.post('/api/search', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Query parameter is required and must be a non-empty string' 
      });
    }

    console.log(`Searching for: ${query}`);
    const products = await searchProducts(query.trim());
    
    res.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Failed to search products',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Eco Shopping Backend running on http://localhost:${PORT}`);
  console.log(`📡 Ready to handle product searches`);
});

