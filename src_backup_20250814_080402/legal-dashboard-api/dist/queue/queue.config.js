"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationQueue = exports.scrapingQueue = void 0;
const bull_1 = __importDefault(require("bull"));
exports.scrapingQueue = new bull_1.default('scraping');
exports.notificationQueue = new bull_1.default('notification');
//# sourceMappingURL=queue.config.js.map