"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summary = summary;
exports.chartsData = chartsData;
exports.aiSuggestions = aiSuggestions;
exports.aiTrainingStats = aiTrainingStats;
exports.aiFeedback = aiFeedback;
exports.performanceMetrics = performanceMetrics;
exports.trends = trends;
async function summary(_req, res) {
    return res.json({
        users: 0,
        documents: 0,
        processingQueue: 0,
        accuracy: 0,
    });
}
async function chartsData(_req, res) {
    return res.json({ labels: [], series: [] });
}
async function aiSuggestions(_req, res) {
    return res.json({ suggestions: [] });
}
async function aiTrainingStats(_req, res) {
    return res.json({ epochs: 0, loss: 0 });
}
async function aiFeedback(_req, res) {
    return res.status(204).send();
}
async function performanceMetrics(_req, res) {
    return res.json({ cpu: 0, memory: 0 });
}
async function trends(_req, res) {
    return res.json({ trends: [] });
}
//# sourceMappingURL=dashboard.controller.js.map