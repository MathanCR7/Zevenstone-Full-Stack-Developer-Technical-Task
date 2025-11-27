const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
// const xss = require('xss-clean'); // <-- COMMENT THIS OUT (Deprecated/Causing issues)
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
// const mongoSanitize = require('express-mongo-sanitize'); // <-- COMMENT THIS OUT (The cause of the crash)
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- CORS Configuration FIX ---
// Define allowed origins using the deployed URL (from env) and localhost
const allowedOrigins = [
  process.env.FRONTEND_URL,          // Deployed URL: https://employee-portal-green.vercel.app
  'http://localhost:5173',           // Local dev environment
];

const corsOptions = {
    origin: (origin, callback) => {
        // Check if the requesting origin is in our allowed list
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log the blocked origin for debugging
            console.log(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true 
};

app.use(cors(corsOptions));
// --- END CORS FIX ---


// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Security Middleware ---
app.use(helmet()); 
// app.use(mongoSanitize()); // <--- DISABLED TO FIX CRASH
// app.use(xss());           // <--- DISABLED TO FIX CRASH
app.use(hpp()); 

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100
});
app.use(limiter);

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));

// Health Check
app.get('/', (req, res) => res.send('API is running...'));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});