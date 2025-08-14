"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = list;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.search = search;
exports.versions = versions;
exports.getVersion = getVersion;
exports.revertToVersion = revertToVersion;
exports.categories = categories;
exports.sources = sources;
const document_service_1 = require("../services/document.service");
const logger_1 = require("../utils/logger");
const websocket_controller_1 = require("./websocket.controller");
async function list(req, res) {
    try {
        const { page = '1', limit = '20', status, category, source, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
        const result = await document_service_1.documentService.listDocuments({
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            status: status,
            category: category,
            source: source,
            sortBy: sortBy,
            sortOrder: sortOrder
        });
        return res.json({
            items: result.items,
            pagination: {
                total: result.total,
                page: result.page,
                pageCount: result.pageCount
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to list documents', error);
        return res.status(500).json({
            error: 'Failed to list documents',
            details: error.message
        });
    }
}
async function getById(req, res) {
    try {
        const { id } = req.params;
        const document = await document_service_1.documentService.getDocumentById(id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        return res.json(document);
    }
    catch (error) {
        logger_1.logger.error('Failed to get document', error);
        return res.status(500).json({
            error: 'Failed to get document',
            details: error.message
        });
    }
}
async function create(req, res) {
    try {
        const userId = req.user?.id || 'system';
        const documentData = req.body;
        const document = await document_service_1.documentService.createDocument(documentData, userId);
        return res.status(201).json(document);
    }
    catch (error) {
        logger_1.logger.error('Failed to create document', error);
        return res.status(500).json({
            error: 'Failed to create document',
            details: error.message
        });
    }
}
async function update(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id || 'system';
        const documentData = req.body;
        const document = await document_service_1.documentService.updateDocument(id, documentData, userId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        return res.json(document);
    }
    catch (error) {
        logger_1.logger.error('Failed to update document', error);
        return res.status(500).json({
            error: 'Failed to update document',
            details: error.message
        });
    }
}
async function remove(req, res) {
    try {
        const { id } = req.params;
        const success = await document_service_1.documentService.deleteDocument(id);
        if (!success) {
            return res.status(404).json({ error: 'Document not found' });
        }
        return res.status(204).send();
    }
    catch (error) {
        logger_1.logger.error('Failed to delete document', error);
        return res.status(500).json({
            error: 'Failed to delete document',
            details: error.message
        });
    }
}
async function search(req, res) {
    try {
        const { q, page = '1', limit = '20', highlight_start = '<em>', highlight_end = '</em>', status } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const result = await document_service_1.documentService.searchDocuments(q, {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            highlightStart: highlight_start,
            highlightEnd: highlight_end,
            status: status
        });
        return res.json({
            query: q,
            results: result.results,
            pagination: {
                total: result.total,
                page: result.page,
                pageCount: result.pageCount
            }
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to search documents', error);
        return res.status(500).json({
            error: 'Failed to search documents',
            details: error.message
        });
    }
}
async function versions(req, res) {
    try {
        const { id } = req.params;
        const document = await document_service_1.documentService.getDocumentById(id);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        const versions = await document_service_1.documentService.getDocumentVersions(id);
        return res.json({ versions });
    }
    catch (error) {
        logger_1.logger.error('Failed to get document versions', error);
        return res.status(500).json({
            error: 'Failed to get document versions',
            details: error.message
        });
    }
}
async function getVersion(req, res) {
    try {
        const { id, version } = req.params;
        const documentVersion = await document_service_1.documentService.getDocumentVersion(id, parseInt(version, 10));
        if (!documentVersion) {
            return res.status(404).json({ error: 'Document version not found' });
        }
        return res.json(documentVersion);
    }
    catch (error) {
        logger_1.logger.error('Failed to get document version', error);
        return res.status(500).json({
            error: 'Failed to get document version',
            details: error.message
        });
    }
}
async function revertToVersion(req, res) {
    try {
        const { id, version } = req.params;
        const userId = req.user?.id || 'system';
        const document = await document_service_1.documentService.revertToVersion(id, parseInt(version, 10), userId);
        if (!document) {
            return res.status(404).json({ error: 'Document or version not found' });
        }
        (0, websocket_controller_1.emitDocumentEvent)(id, 'document_reverted', {
            id,
            version: document.version,
            previousVersion: parseInt(version, 10),
            userId
        });
        return res.json(document);
    }
    catch (error) {
        logger_1.logger.error('Failed to revert document', error);
        return res.status(500).json({
            error: 'Failed to revert document',
            details: error.message
        });
    }
}
async function categories(_req, res) {
    try {
        const categories = await document_service_1.documentService.getCategories();
        return res.json({ categories });
    }
    catch (error) {
        logger_1.logger.error('Failed to get categories', error);
        return res.status(500).json({
            error: 'Failed to get categories',
            details: error.message
        });
    }
}
async function sources(_req, res) {
    try {
        const sources = await document_service_1.documentService.getSources();
        return res.json({ sources });
    }
    catch (error) {
        logger_1.logger.error('Failed to get sources', error);
        return res.status(500).json({
            error: 'Failed to get sources',
            details: error.message
        });
    }
}
//# sourceMappingURL=documents.controller.js.map