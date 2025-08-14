import { Express } from 'express';
import authRoutes from './auth.routes';
import dashboardRoutes from './dashboard.routes';
// import documentsRoutes from './documents.routes';
import analyticsRoutes from './analytics.routes';
import enhancedAnalyticsRoutes from './enhanced-analytics.routes';
import ocrRoutes from './ocr.routes';
import reportsRoutes from './reports.routes';
import scrapingRoutes from './scraping.routes';
import websocketRoutes from './websocket.routes';
import ratingRoutes from './rating.routes';
import proxyRoutes from './proxy.routes';

export function registerRoutes(app: Express): void {
    app.get('/health', (_req, res) => res.json({ status: 'ok' }));
    app.use('/api/auth', authRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    // app.use('/api/documents', documentsRoutes);
    app.use('/api/analytics', analyticsRoutes);
    app.use('/api/enhanced-analytics', enhancedAnalyticsRoutes);
    // app.use('/api/ocr', ocrRoutes);
    // app.use('/api/reports', reportsRoutes);
    app.use('/api/scraping', scrapingRoutes);
    app.use('/api/ws', websocketRoutes);
    app.use('/api/ratings', ratingRoutes);
    app.use('/api/proxy', proxyRoutes);
}


