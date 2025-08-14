// Mock data for fallback when backend is unavailable
const mockData = {
    analytics: {
        totalDocuments: 1247,
        activeCases: 89,
        completionRate: 87.5,
        totalItems: 47582,
        recentItems: 1843,
        categories: { 'Legal': 12450, 'Economic': 8920, 'Social': 7830, 'Cultural': 6240, 'Technical': 5100 },
        avgRating: 0.891,
        todayStats: { success_rate: 94.1 },
        weeklyTrend: [
            { day: 'Mon', success: 231 }, { day: 'Tue', success: 295 }, { day: 'Wed', success: 374 },
            { day: 'Thu', success: 345 }, { day: 'Fri', success: 396 }, { day: 'Sat', success: 281 }, { day: 'Sun', success: 150 }
        ],
        monthlyGrowth: 18.3
    },
    scrapingStats: {
        totalSources: 12,
        activeSources: 8,
        recentlyScraped: 45,
        successRate: 94.1,
        failedJobs: 3,
        queuedJobs: 7
    },
    documents: {
        items: [
            { id: '1', title: 'Labor Law - 2024 Amendment', domain: 'dastour.ir', status: 'completed', category: 'Legal' },
            { id: '2', title: 'E-Commerce Regulations Act', domain: 'majles.ir', status: 'completed', category: 'Economic' },
            { id: '3', title: 'Data Protection Directive', domain: 'president.ir', status: 'processing', category: 'Technical' },
            { id: '4', title: 'New Import/Export Tariffs', domain: 'customs.ir', status: 'failed', category: 'Economic' },
            { id: '5', title: 'National Cultural Development Plan', domain: 'farhang.gov.ir', status: 'completed', category: 'Cultural' }
        ],
        total: 1247,
        page: 1,
        limit: 20
    }
};

// Utility function for safe Persian text encoding
function safePersianEncode(text: string): string {
    try {
        return encodeURIComponent(text);
    } catch (error) {
        console.warn('Failed to encode Persian text:', text);
        return text;
    }
}

// Utility function for safe Persian text decoding
function safePersianDecode(text: string): string {
    try {
        return decodeURIComponent(text);
    } catch (error) {
        console.warn('Failed to decode Persian text:', text);
        return text;
    }
}

class ApiClient {
    private baseUrl = import.meta.env.VITE_API_URL || '/api';
    private get token() {
        return localStorage.getItem('accessToken') || localStorage.getItem('authToken');
    }

    private async fetch(path: string, options: RequestInit = {}) {
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };
        
        try {
            const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
            
            // Log response for debugging
            console.log(`API Request: ${this.baseUrl}${path}`, {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });
            
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("API Error Response:", {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorBody
                });
                
                // Handle specific error cases
                if (response.status === 500) {
                    throw new Error(`Server error: ${response.statusText}`);
                } else if (response.status === 404) {
                    throw new Error(`Endpoint not found: ${path}`);
                } else {
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return response.text();
            }
        } catch (error) {
            // Check if it's a connection error
            if (error instanceof TypeError && error.message.includes('fetch')) {
                console.warn(`Backend connection failed for ${path} - using mock data`);
                throw new Error('ERR_CONNECTION_REFUSED');
            }
            throw error;
        }
    }

    private async fetchWithFallback(path: string, fallbackData: any, options: RequestInit = {}) {
        try {
            return await this.fetch(path, options);
        } catch (error) {
            if (error instanceof Error && error.message.includes('ERR_CONNECTION_REFUSED')) {
                console.warn(`Using mock data for ${path} - backend not available`);
                return fallbackData;
            }
            throw error;
        }
    }

    // ===== DOCUMENT MANAGEMENT METHODS =====

    async getDocuments(filters: Record<string, any> = {}) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                // Handle Persian text encoding for search parameters
                if (typeof value === 'string' && /[\u0600-\u06FF]/.test(value)) {
                    params.append(key, safePersianEncode(value));
                } else {
                    params.append(key, String(value));
                }
            }
        });
        return this.fetchWithFallback(`/documents?${params}`, mockData.documents);
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
                    value.forEach(v => {
                        if (typeof v === 'string' && /[\u0600-\u06FF]/.test(v)) {
                            params.append(key, safePersianEncode(v));
                        } else {
                            params.append(key, String(v));
                        }
                    });
                } else {
                    // Handle Persian text encoding
                    if (typeof value === 'string' && /[\u0600-\u06FF]/.test(value)) {
                        params.append(key, safePersianEncode(value));
                    } else {
                        params.append(key, String(value));
                    }
                }
            }
        });
        return this.fetch(`/documents/search?${params}`);
    }

    async getDocumentSuggestions(query: string) {
        const encodedQuery = safePersianEncode(query);
        return this.fetch(`/documents/suggestions?q=${encodedQuery}`);
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
                if (typeof value === 'string' && /[\u0600-\u06FF]/.test(value)) {
                    params.append(key, safePersianEncode(value));
                } else {
                    params.append(key, String(value));
                }
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
        return this.fetchWithFallback('/analytics', mockData.analytics, {
            method: 'POST',
            body: JSON.stringify(dateRange),
        });
    }

    async getScrapingStats() {
        return this.fetchWithFallback('/scraping/stats', mockData.scrapingStats);
    }

    async listScrapingSources() {
        return this.fetchWithFallback('/scraping/sources', { sources: [], count: 0 });
    }
}

export const apiClient = new ApiClient();
