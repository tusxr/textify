require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const ocrRoutes = require('./routes/ocrRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// ✅ Allowed frontend domains
const allowedOrigins = ['https://textify-tusxr.vercel.app'];

// ✅ CORS middleware
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked CORS for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight requests
console.log("Updated CORS config")
app.use(helmet()); // Security
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ✅ Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// ✅ Routes
app.use('/api/ocr', ocrRoutes);

// ✅ Health check route
app.get('/health', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  res.status(200).json({ status: 'ok' });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ✅ Start the server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Optional: Tweak timeout settings for larger OCR tasks
server.keepAliveTimeout = 60000;
server.headersTimeout = 65000;

module.exports = app;
////////////////////////////////////////
// require('dotenv').config();
// const express = require('express');
// var cors = require('cors');
// const morgan = require('morgan');
// const path = require('path');
// const fs = require('fs');
// const helmet = require('helmet');
// const ocrRoutes = require('./routes/ocrRoutes');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// // const allowedOrigins = [
// //   'https://textify-tusxr.vercel.app',
// //   'https://textify-tusxr.vercel.app/' // Include both variants
// // ];

// // // Configure CORS with more specific settings
// // const corsOptions = {
// //   origin: function (origin, callback) {
// //     if (!origin || allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       console.log('Blocked CORS for origin:', origin);
// //       callback(new Error('Not allowed by CORS'));
// //     }
// //   },
// //   methods: ['GET', 'POST', 'OPTIONS'],
// //   allowedHeaders: [
// //     'Content-Type',
// //     'Authorization',
// //     'Accept',
// //     'X-Requested-With'
// //   ],
// //   credentials: true,
// //   maxAge: 86400 // 24 hours for preflight cache
// // };

// const allowedOrigins = ['https://textify-tusxr.vercel.app'];
// app.use(cors());
// app.use(cors({
//   origin: function(origin, callback){
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true, // if you're using cookies or auth headers
// }));
// // Middleware ordering is CRUCIAL
// app.use(helmet());
// app.use(morgan('dev'));

// // Apply CORS middleware before other middleware
// app.use(cors(corsOptions));

// // Explicit OPTIONS handler for all routes
// app.options('*', cors(corsOptions));

// // Body parsers
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Log all incoming requests
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   next();
// });

// // Serve uploaded files
// app.use('/uploads', express.static(uploadsDir));

// // Routes
// app.use('/api/ocr', ocrRoutes);

// // Health check with CORS headers
// app.get('/health', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
//   res.status(200).json({ status: 'ok' });
// });

// // Error handler
// app.use((err, req, res, next) => {
//   console.error(`[ERROR] ${req.method} ${req.url}:`, err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.stack : undefined
//   });
// });

// // Server setup
// const server = app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

// // Handle server timeouts
// server.keepAliveTimeout = 60000; // 60 seconds
// server.headersTimeout = 65000; // 65 seconds

// module.exports = app
// // // server/server.js
// // require('dotenv').config();
// // const express = require('express');
// // const cors = require('cors');
// // const morgan = require('morgan');
// // const path = require('path');
// // const fs = require('fs');
// // const helmet = require('helmet');
// // const ocrRoutes = require('./routes/ocrRoutes');

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // Ensure uploads directory exists
// // const uploadsDir = path.join(__dirname, 'uploads');
// // if (!fs.existsSync(uploadsDir)) {
// //   fs.mkdirSync(uploadsDir);
// // }
// // const allowedOrigins = ['https://textify-tusxr.vercel.app'];
// // // Middleware
// // app.use(helmet()); // Security headers
// // app.use(cors({
// //   origin: allowedOrigins,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization'],
// //   credentials: true
// // }));
// // app.use((req, res, next) => {
// //   console.log('Incoming request:', req.method, req.url);
// //   next();
// // });
// // // ✅ Handle preflight requests properly
// // app.options('*', cors());
// // app.use(express.json());
// // app.use(morgan('dev'));
// // app.use(express.urlencoded({ extended: true }));

// // // Serve uploaded files
// // app.use('/uploads', express.static(uploadsDir));

// // // Routes
// // app.use('/api/ocr', ocrRoutes);

// // // Health check
// // app.get('/health', (req, res) => {
// //   res.status(200).json({ status: 'ok' });
// // });

// // // Global error handler
// // app.use((err, req, res, next) => {
// //   console.error(`[ERROR] ${req.method} ${req.url}:`, err.stack);
// //   res.status(500).json({
// //     success: false,
// //     message: 'Something went wrong on the server',
// //     error: process.env.NODE_ENV === 'development' ? err.message : {}
// //   });
// // });
// // process.on('uncaughtException', err => {
// //   console.error('Uncaught Exception:', err);
// // });
// // process.on('unhandledRejection', err => {
// //   console.error('Unhandled Rejection:', err);
// // });
// // // Start server
// // app.listen(PORT, () => {
// //   console.log(`✅ Server running on http://localhost:${PORT}`);
// // });

// // module.exports = app;
