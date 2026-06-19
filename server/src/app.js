import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import requestLogger from './middleware/requestLogger.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Middleware
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());
app.use(requestLogger);

// Routes
app.use(routes);

// Global error handler — must be last
app.use(errorHandler);

export default app;
