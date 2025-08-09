"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const config_1 = require("./config");
const levelOrder = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};
const current = (() => {
    const lvl = (config_1.config.LOG_LEVEL || 'info').toLowerCase();
    return ['error', 'warn', 'info', 'debug'].includes(lvl)
        ? lvl
        : 'info';
})();
function log(level, message, meta) {
    if (levelOrder[level] <= levelOrder[current]) {
        const ts = new Date().toISOString();
        console.log(`${ts} | ${level.toUpperCase()} | ${message}`, meta ?? '');
    }
}
exports.logger = {
    error: (msg, meta) => log('error', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta),
    info: (msg, meta) => log('info', msg, meta),
    debug: (msg, meta) => log('debug', msg, meta),
};
//# sourceMappingURL=logger.js.map