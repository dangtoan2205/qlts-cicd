// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/employees', require('./routes/employees'));
// app.use('/api/assets', require('./routes/assets'));
// app.use('/api/asset-types', require('./routes/assetTypes'));
// app.use('/api/assignments', require('./routes/assignments'));
// app.use('/api/activity-logs', require('./routes/activityLogs'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/export', require('./routes/export'));
// app.use('/api/import', require('./routes/import'));

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ message: 'QLTS Asset Management API đang hoạt động', status: 'OK' });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Có lỗi xảy ra trên server!' });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ message: 'API endpoint không tồn tại' });
// });

// app.listen(PORT, () => {
//   console.log(`Server đang chạy trên port ${PORT}`);
//   console.log(`API Health Check: http://localhost:${PORT}/api/health`);
// });



//-----

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve React frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// Backend API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/assets', require('./routes/assets'));
app.use('/api/asset-types', require('./routes/assetTypes'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/activity-logs', require('./routes/activityLogs'));
app.use('/api/users', require('./routes/users'));
app.use('/api/export', require('./routes/export'));
app.use('/api/import', require('./routes/import'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'QLTS Asset Management API đang hoạt động', status: 'OK' });
});

// React catch-all → trả về index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Có lỗi xảy ra trên server!' });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy trên port ${PORT}`);
  console.log(`API Health Check: http://localhost:${PORT}/api/health`);
});
