require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
}));

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Todo App Server');
});

// Use todo routes
app.use('/api/todos', todoRoutes);

// MongoDB/Cosmos DB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo-mb';

// Cosmos DB를 위한 mongoose 옵션
const mongooseOptions = {
  retryWrites: false,  // Cosmos DB는 retryWrites를 지원하지 않음
  ssl: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
};

mongoose.connect(MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('Database Connected Successfully');
    console.log('Connected to:', MONGODB_URI.includes('cosmos.azure.com') ? 'Azure Cosmos DB' : 'Local MongoDB');
    // Start Server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database Connection Failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  });
