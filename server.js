const express = require('express');
const cors = require('cors');
require('dotenv').config();

const examRoutes = require('./src/routes/examRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/exam', examRoutes);

// Health check
// Update the test-ai endpoint
app.get('/test-ai', async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    
    // Use the correct model name
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    console.log('Testing Gemini 2.5 Flash...');
    const result = await model.generateContent('Say hello in a friendly way!');
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      success: true, 
      message: 'API key works perfectly!',
      model: 'gemini-2.5-flash',
      response: text 
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CBET Backend running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/exam`);
});