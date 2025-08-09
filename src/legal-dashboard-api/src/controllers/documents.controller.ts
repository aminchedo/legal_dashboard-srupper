import { Request, Response } from 'express';
import { documentService } from '@services/document.service';
import { logger } from '@utils/logger';
import { emitDocumentEvent } from '@controllers/websocket.controller';

/**
 * List documents with filtering and pagination
 */
export async function list(req: Request, res: Response) {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      category,
      source,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const result = await documentService.listDocuments({
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      status: status as string,
      category: category as string,
      source: source as string,
      sortBy: sortBy as string,
      sortOrder: (sortOrder as 'asc' | 'desc')
    });

    return res.json({
      items: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        pageCount: result.pageCount
      }
    });
  } catch (error) {
    logger.error('Failed to list documents', error);
    return res.status(500).json({
      error: 'Failed to list documents',
      details: (error as Error).message
    });
  }
}

/**
 * Get document by ID
 */
export async function getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const document = await documentService.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    return res.json(document);
  } catch (error) {
    logger.error('Failed to get document', error);
    return res.status(500).json({
      error: 'Failed to get document',
      details: (error as Error).message
    });
  }
}

/**
 * Create a new document
 */
export async function create(req: Request, res: Response) {
  try {
    // @ts-ignore - User is attached by auth middleware
    const userId = req.user?.id || 'system';
    const documentData = req.body;

    const document = await documentService.createDocument(documentData, userId);

    return res.status(201).json(document);
  } catch (error) {
    logger.error('Failed to create document', error);
    return res.status(500).json({
      error: 'Failed to create document',
      details: (error as Error).message
    });
  }
}

/**
 * Update an existing document
 */
export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    // @ts-ignore - User is attached by auth middleware
    const userId = req.user?.id || 'system';
    const documentData = req.body;

    const document = await documentService.updateDocument(id, documentData, userId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    return res.json(document);
  } catch (error) {
    logger.error('Failed to update document', error);
    return res.status(500).json({
      error: 'Failed to update document',
      details: (error as Error).message
    });
  }
}

/**
 * Delete a document
 */
export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const success = await documentService.deleteDocument(id);

    if (!success) {
      return res.status(404).json({ error: 'Document not found' });
    }

    return res.status(204).send();
  } catch (error) {
    logger.error('Failed to delete document', error);
    return res.status(500).json({
      error: 'Failed to delete document',
      details: (error as Error).message
    });
  }
}

/**
 * Search documents using full-text search
 */
export async function search(req: Request, res: Response) {
  try {
    const {
      q,
      page = '1',
      limit = '20',
      highlight_start = '<em>',
      highlight_end = '</em>',
      status
    } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const result = await documentService.searchDocuments(q, {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      highlightStart: highlight_start as string,
      highlightEnd: highlight_end as string,
      status: status as string
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
  } catch (error) {
    logger.error('Failed to search documents', error);
    return res.status(500).json({
      error: 'Failed to search documents',
      details: (error as Error).message
    });
  }
}

/**
 * Get document version history
 */
export async function versions(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check if document exists
    const document = await documentService.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const versions = await documentService.getDocumentVersions(id);

    return res.json({ versions });
  } catch (error) {
    logger.error('Failed to get document versions', error);
    return res.status(500).json({
      error: 'Failed to get document versions',
      details: (error as Error).message
    });
  }
}

/**
 * Get specific document version
 */
export async function getVersion(req: Request, res: Response) {
  try {
    const { id, version } = req.params;

    const documentVersion = await documentService.getDocumentVersion(
      id,
      parseInt(version, 10)
    );

    if (!documentVersion) {
      return res.status(404).json({ error: 'Document version not found' });
    }

    return res.json(documentVersion);
  } catch (error) {
    logger.error('Failed to get document version', error);
    return res.status(500).json({
      error: 'Failed to get document version',
      details: (error as Error).message
    });
  }
}

/**
 * Revert document to a specific version
 */
export async function revertToVersion(req: Request, res: Response) {
  try {
    const { id, version } = req.params;
    // @ts-ignore - User is attached by auth middleware
    const userId = req.user?.id || 'system';

    const document = await documentService.revertToVersion(
      id,
      parseInt(version, 10),
      userId
    );

    if (!document) {
      return res.status(404).json({ error: 'Document or version not found' });
    }

    // Emit websocket event
    emitDocumentEvent(id, 'document_reverted', {
      id,
      version: document.version,
      previousVersion: parseInt(version, 10),
      userId
    });

    return res.json(document);
  } catch (error) {
    logger.error('Failed to revert document', error);
    return res.status(500).json({
      error: 'Failed to revert document',
      details: (error as Error).message
    });
  }
}

/**
 * Get list of unique document categories
 */
export async function categories(_req: Request, res: Response) {
  try {
    const categories = await documentService.getCategories();
    return res.json({ categories });
  } catch (error) {
    logger.error('Failed to get categories', error);
    return res.status(500).json({
      error: 'Failed to get categories',
      details: (error as Error).message
    });
  }
}

/**
 * Get list of unique document sources
 */
export async function sources(_req: Request, res: Response) {
  try {
    const sources = await documentService.getSources();
    return res.json({ sources });
  } catch (error) {
    logger.error('Failed to get sources', error);
    return res.status(500).json({
      error: 'Failed to get sources',
      details: (error as Error).message
    });
  }
}


