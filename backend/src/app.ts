import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import http from 'http';
import { Server } from 'socket.io';

import { registerRoutes } from './routes';
import { errorHandler } from './middleware/error.middleware';
import { apiRateLimiter } from './middleware/rate-limit.middleware';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { attachSocket } from './controllers/websocket.controller';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: config.CORS_ORIGIN,
        credentials: true
    }
});

// Attach Socket.IO to the server
attachSocket(server);

app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: config.UPLOAD_MAX_SIZE.toString() }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('combined'));
app.use('/api', apiRateLimiter);

// Make io available in routes
app.set('io', io);

registerRoutes(app);
app.use(errorHandler);

const port = config.PORT;
server.listen(port, () => {
    logger.info(`API server running on port ${port}`);
    logger.info(`Socket.IO server attached to HTTP server`);
});

export { app, server, io };


