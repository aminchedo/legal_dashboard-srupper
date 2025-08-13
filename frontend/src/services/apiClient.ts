class ApiClient {
    private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    private get token() {
        return localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    }

    private async fetch(path: string, options: RequestInit = {}) {
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        };
        const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("API Error Response:", errorBody);
            throw new Error(`API request failed: ${response.statusText}`);
        }
        return response.json();
    }

    // ===== DOCUMENT MANAGEMENT METHODS =====

    async getDocuments(filters: Record<string, any> = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });
        return this.fetch(`/documents?${params}`);
    }

    async getDocumentById(id: string) {
        return this.fetch(`/documents/${id}`);
    }

    async createDocument(data: Record<string, any>) {
        return this.fetch('/documents', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateDocument(id: string, data: Record<string, any>) {
        return this.fetch(`/documents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteDocument(id: string) {
        return this.fetch(`/documents/${id}`, { method: 'DELETE' });
    }

    // ===== ADVANCED SEARCH METHODS =====

    async searchDocuments(searchQuery: {
        query?: string;
        category?: string;
        source?: string;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
        tags?: string[];
        minScore?: number;
        maxScore?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        page?: number;
        limit?: number;
    }) {
        const params = new URLSearchParams();
        Object.entries(searchQuery).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, String(v)));
                } else {
                    params.append(key, String(value));
                }
            }
        });
        return this.fetch(`/documents/search?${params}`);
    }

    async getDocumentSuggestions(query: string) {
        return this.fetch(`/documents/suggestions?q=${encodeURIComponent(query)}`);
    }

    // ===== BULK OPERATIONS =====

    async bulkDeleteDocuments(ids: string[]) {
        return this.fetch('/documents/bulk/delete', {
            method: 'POST',
            body: JSON.stringify({ ids }),
        });
    }

    async bulkUpdateDocuments(ids: string[], updates: Record<string, any>) {
        return this.fetch('/documents/bulk/update', {
            method: 'POST',
            body: JSON.stringify({ ids, updates }),
        });
    }

    async bulkCategorizeDocuments(ids: string[], category: string) {
        return this.fetch('/documents/bulk/categorize', {
            method: 'POST',
            body: JSON.stringify({ ids, category }),
        });
    }

    async bulkTagDocuments(ids: string[], tags: string[]) {
        return this.fetch('/documents/bulk/tag', {
            method: 'POST',
            body: JSON.stringify({ ids, tags }),
        });
    }

    // ===== EXPORT/IMPORT METHODS =====

    async exportDocuments(filters: Record<string, any> = {}, format: 'json' | 'csv' | 'xlsx' = 'json') {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });
        params.append('format', format);
        
        const response = await fetch(`${this.baseUrl}/documents/export?${params}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
        });
        
        if (!response.ok) {
            throw new Error(`Export failed: ${response.statusText}`);
        }
        
        return response.blob();
    }

    async importDocuments(file: File, options: {
        overwrite?: boolean;
        categoryMapping?: Record<string, string>;
        skipInvalid?: boolean;
    } = {}) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('options', JSON.stringify(options));
        
        const response = await fetch(`${this.baseUrl}/documents/import`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: formData,
        });
        
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Import failed: ${response.statusText} - ${errorBody}`);
        }
        
        return response.json();
    }

    async validateImportFile(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${this.baseUrl}/documents/import/validate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`Validation failed: ${response.statusText}`);
        }
        
        return response.json();
    }

    // ===== CATEGORIZATION & TAGGING =====

    async getCategories() {
        return this.fetch('/documents/categories');
    }

    async createCategory(name: string, description?: string, color?: string) {
        return this.fetch('/documents/categories', {
            method: 'POST',
            body: JSON.stringify({ name, description, color }),
        });
    }

    async updateCategory(id: string, data: Record<string, any>) {
        return this.fetch(`/documents/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteCategory(id: string) {
        return this.fetch(`/documents/categories/${id}`, { method: 'DELETE' });
    }

    async getTags() {
        return this.fetch('/documents/tags');
    }

    async createTag(name: string, color?: string) {
        return this.fetch('/documents/tags', {
            method: 'POST',
            body: JSON.stringify({ name, color }),
        });
    }

    // ===== DOCUMENT WORKFLOW =====

    async updateDocumentStatus(id: string, status: string, comment?: string) {
        return this.fetch(`/documents/${id}/status`, {
            method: 'POST',
            body: JSON.stringify({ status, comment }),
        });
    }

    async getDocumentHistory(id: string) {
        return this.fetch(`/documents/${id}/history`);
    }

    async getDocumentVersions(id: string) {
        return this.fetch(`/documents/${id}/versions`);
    }

    async revertDocumentVersion(id: string, version: number) {
        return this.fetch(`/documents/${id}/revert`, {
            method: 'POST',
            body: JSON.stringify({ version }),
        });
    }

    // ===== ANALYTICS & STATISTICS =====

    async getDocumentAnalytics(dateRange = {}) {
        return this.fetch('/documents/analytics', {
            method: 'POST',
            body: JSON.stringify(dateRange),
        });
    }

    async getDocumentStatistics() {
        return this.fetch('/documents/statistics');
    }

    // ===== EXISTING METHODS =====

    async getAnalytics(dateRange = {}) {
        return this.fetch('/analytics', {
            method: 'POST',
            body: JSON.stringify(dateRange),
        });
    }

    async getScrapingStats() {
        return this.fetch('/scraping/stats');
    }

    async listScrapingSources() {
        return this.fetch('/scraping/sources');
    }
}

export const apiClient = new ApiClient();
