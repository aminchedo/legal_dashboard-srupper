/* Simple console logger with levels */
import { config } from './config';

type Level = 'error' | 'warn' | 'info' | 'debug';

const levelOrder: Record<Level, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

const current = ((): Level => {
    const lvl = (config.LOG_LEVEL || 'info').toLowerCase();
    return (['error', 'warn', 'info', 'debug'] as Level[]).includes(lvl as Level)
        ? (lvl as Level)
        : 'info';
})();

function log(level: Level, message: string, meta?: unknown): void {
    if (levelOrder[level] <= levelOrder[current]) {
        const ts = new Date().toISOString();
        // eslint-disable-next-line no-console
        console.log(`${ts} | ${level.toUpperCase()} | ${message}`, meta ?? '');
    }
}

export const logger = {
    error: (msg: string, meta?: unknown) => log('error', msg, meta),
    warn: (msg: string, meta?: unknown) => log('warn', msg, meta),
    info: (msg: string, meta?: unknown) => log('info', msg, meta),
    debug: (msg: string, meta?: unknown) => log('debug', msg, meta),
};


