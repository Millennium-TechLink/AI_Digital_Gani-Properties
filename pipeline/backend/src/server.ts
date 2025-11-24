import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import propertiesRouter from './routes/properties.js';
import uploadRouter from './routes/upload.js';
import authRouter from './routes/auth.js';
import { initializeFromMainApp } from './utils/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize data from main app if available
initializeFromMainApp();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
const publicUploadsDir = join(__dirname, '../public/uploads');
if (!existsSync(publicUploadsDir)) {
  mkdirSync(publicUploadsDir, { recursive: true });
}
app.use('/uploads', express.static(publicUploadsDir));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth Routes (public)
app.use('/api/auth', authRouter);

// API Routes
app.use('/api/properties', propertiesRouter);
app.use('/api/upload', uploadRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Property Pipeline API server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🏠 Properties API: http://localhost:${PORT}/api/properties`);
});

